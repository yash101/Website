Righto mate, you’re in for a bit of dev-opsin’ with **MicroK8s** on your box. We’ll break down:

1. **Auto-start MicroK8s**  
2. **Get a bridged IP** (so you can talk to your LAN & gateway directly)  
3. **Host an Ubuntu “dev environment”** container or Pod, with full network access  
4. **Enable a permanent MicroK8s web interface** (K8s dashboard or something similar)  
5. **Spin up Postgres, Redis, and OpenSearch or Solr** in MicroK8s  
6. **Define your entire system** in a single set of manifests (so you can redeploy anywhere)  
7. **Expose ports** for UI, APIs, etc.

Buckle up: this’ll be a bit meaty, but you’ll be on track to dev paradise.

---

## 1. **Install & Auto-Start MicroK8s**

Assuming Ubuntu-ish host:

```bash
sudo snap install microk8s --classic --channel=latest/stable
```

- Add yourself to the `microk8s` group (so you’re not rootin’ all day):
  ```bash
  sudo usermod -aG microk8s $USER
  newgrp microk8s
  ```
- Enable auto-start on boot:
  ```bash
  sudo snap enable microk8s
  ```

That ensures each time your machine boots, **MicroK8s** fires up.

---

## 2. **Bridged Networking for MicroK8s**

By default, MicroK8s uses [Flannel](https://flannel.io/) or [Calico](https://projectcalico.org/) for cluster networking, which might not assign pods an IP from your LAN’s DHCP. If you want containers/pods to appear on the local network (like VMs bridging to your router), you’ve got a few approaches:

### Option A: **`microk8s enable metallb`** + local subrange

- `MetalLB` is a barebones load-balancer for K8s that can hand out IPs from a range you specify. 
- If your router uses `192.168.1.0/24`, you can carve out a chunk: e.g. `192.168.1.240-192.168.1.250`.
- Then `MetalLB` will hand out those IPs to **Services** of type `LoadBalancer`.

```bash
microk8s enable dns metallb:192.168.1.240-192.168.1.250
```

Now, if you create a `Service` of type `LoadBalancer`, it’ll pick an IP from that pool. That’s *not* strictly “DHCP from your router,” but it’s effectively bridging onto your LAN with real IP addresses.

### Option B: **Use Host Networking** for certain pods

If you just want your “dev container” to behave like a normal process on the host:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: dev-env
spec:
  hostNetwork: true
  containers:
    - name: dev-container
      image: ubuntu:22.04
      command: [ "sleep", "infinity" ]
```

**Downside**: That Pod will share networking with the host. If you need multiple pods, you can get port conflicts. Also less “pure K8s.”

---

## 3. **Ubuntu-ish Dev Container**

Let’s do this the **Kubernetes** way — spin a Pod/Deployment that runs an Ubuntu image:

```yaml
# dev-env.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-env
spec:
  replicas: 1
  selector:
    matchLabels:
      app: dev-env
  template:
    metadata:
      labels:
        app: dev-env
    spec:
      containers:
      - name: dev-env
        image: ubuntu:22.04
        command: ["sleep", "infinity"]
        tty: true
        stdin: true
```

Apply it:

```bash
microk8s kubectl apply -f dev-env.yaml
```

Now you can shell in:

```bash
microk8s kubectl exec -it deployment/dev-env -- bash
```

**Inside** there, you can install dev tools as you like (git, build-essential, curl, etc.).  
If you want bridging / host-level IP, combine it with `hostNetwork: true` or `MetalLB`.

---

## 4. **Enable the MicroK8s Web Interface (Dashboard)**

MicroK8s bundles a **K8s Dashboard**:

```bash
microk8s enable dashboard
```

This spins up the standard Kubernetes Dashboard. By default, you gotta do:

```bash
microk8s kubectl port-forward -n kube-system service/kubernetes-dashboard 10443:443
```

Then open [https://localhost:10443/](https://localhost:10443/).  
But that’s ephemeral. You want it “permanently” accessible.

### Use Ingress or MetalLB:

#### 4a. Ingress + NodePort:

```bash
microk8s enable ingress
```

Create an Ingress resource that points to the dashboard’s service in the `kube-system` namespace. Or just set the `Service` type to `LoadBalancer` if you’re using MetalLB:

```bash
microk8s kubectl edit svc kubernetes-dashboard -n kube-system
```

Change `type: ClusterIP` → `type: LoadBalancer`. If you’ve got MetalLB, it’ll get an IP from your range. Then you can browse it from your LAN at `https://<that-ip>/`.

**Either approach**: you’ll still need a token or cert for login. The docs:  
<https://github.com/kubernetes/dashboard>

---

## 5. **Deploy Postgres, Redis, and OpenSearch/Solr**

**Using official Helm Charts** is the easiest. Quick steps:

### 5a. Enable Helm in MicroK8s (optional step)

MicroK8s typically has `helm`:

```bash
snap alias microk8s.helm3 helm
```

Then:

```bash
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
```

### 5b. Deploy Postgres

```bash
helm install my-postgres bitnami/postgresql --set auth.username=admin,auth.password=SuperSecret
```

It’ll create a **StatefulSet**, a Service, and a PVC. By default, it’s `ClusterIP` — so it’s only visible inside the cluster. If you want an external IP (for dev?), switch to `type=LoadBalancer` or expose via Ingress for TCP. Alternatively, just use `port-forward`:

```bash
microk8s kubectl port-forward svc/my-postgres-postgresql 5432:5432
```

### 5c. Redis

```bash
helm install my-redis bitnami/redis --set auth.enabled=false
```
*(Just for dev, or set a password if needed.)*

### 5d. OpenSearch or Solr

**OpenSearch**:
```bash
helm repo add opensearch https://opensearch-project.github.io/helm-charts/
helm install opensearch opensearch/opensearch
```

**Solr** (Bitnami chart again):
```bash
helm install my-solr bitnami/solr
```

All of these can be pinned to specific versions or configured with storage classes for persistence.

---

## 6. **Define the Entire System Architecture for Easy Redeploy**

Typically, you create a **Git repo** with your K8s manifests or Helm chart values so you can replicate the environment anywhere. Something like:

```
my-infra/
  ├─ helm-charts/
  │   ├─ values-postgres.yaml
  │   ├─ values-redis.yaml
  │   └─ values-solr.yaml
  ├─ deployments/
  │   ├─ dev-env.yaml
  │   └─ ...
  └─ README.md
```

Inside `values-postgres.yaml`, you store your custom config:

```yaml
auth:
  username: myuser
  password: mypass
primary:
  persistence:
    size: 5Gi
```

Then to install:

```bash
helm install my-postgres bitnami/postgresql -f helm-charts/values-postgres.yaml
```

**Version control** that repo, so if you blow away your cluster or spin up a new region, you just do:

```bash
microk8s reset
# re-enable needed add-ons
helm install ...
```

Everything’s back.

---

## 7. **Port Forwarding & External Access**

### **Option A: NodePort**  
Let’s say your UI runs on port 3000 in a pod. In your `Service`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-ui
spec:
  type: NodePort
  selector:
    app: my-ui
  ports:
    - name: http
      port: 3000
      targetPort: 3000
      nodePort: 30300
```

Then you can hit `http://<host-ip>:30300/` to get to your app. The NodePort `30300` is automatically assigned or you can specify. Not super elegant, but it works.

### **Option B: LoadBalancer (MetalLB)**  
If you used `metalLB:192.168.1.240-192.168.1.250`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-ui
spec:
  type: LoadBalancer
  ports:
    - port: 80
      targetPort: 3000
  selector:
    app: my-ui
```

MicroK8s will request an IP in that range, say `192.168.1.241`. Then you can browse <http://192.168.1.241/>.

### **Option C: Ingress**  
If you enable `microk8s enable ingress`, you can set up an **Ingress resource** with a hostname like `myapp.local` pointing to your service. Good if you have lots of services and want them on standard ports 80/443:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: my-ui
            port:
              number: 3000
```

Then in `/etc/hosts` on your dev machine:

```
192.168.1.240  myapp.local
```

Boom, neat domain-based routing.

---

## Wrap-up

1. **Auto-Start**: Snap manages that for ya.
2. **Bridged IP**: Use **MetalLB** or **host networking**.  
3. **Ubuntu Dev** container: simple Deployment, `microk8s kubectl exec` in.  
4. **MicroK8s Dashboard**: Enable it, expose via NodePort or LoadBalancer.  
5. **Postgres, Redis, Solr**: Use **Helm charts** for quick setups.  
6. **Git + Manifests**: Keep everything in one repo to replicate easily.  
7. **Port Forwarding**: NodePort, LoadBalancer, or Ingress (your call).

With that blueprint, you can spin up your entire dev environment anywhere MicroK8s runs — local box, VM, or even servers. You’ll be slingin’ pods around like a pro. Beauty.  

Got more Qs about volumes, persistent storage, or advanced traffic rules? Just holler, mate — always happy to help you wrangle the next wave of container chaos. Cheers!
