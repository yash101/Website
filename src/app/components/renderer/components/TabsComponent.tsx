import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DOMNode, domToReact, Element } from "html-react-parser";

interface TabsComponentProps {
  node: DOMNode;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ node }) => {
  const nodeAsElement = node as Element || null;
  // should be impossible in the happy path since this check is done in the parent renderer
  if (node.type !== 'tag' || !nodeAsElement) {
    return (<p>Error, unable to render TabsComponent.</p>);
  }

  const tabs = [];
  const contents: Record<string, DOMNode[]> = {};

  const childNodes = nodeAsElement.childNodes;

  let headerWrapper = null;
  let tabsContainer = null;

  // Get the tabs and the content divs
  for (const cn of childNodes) {
    if (cn.type === 'tag' && cn.attribs.class.includes('tabs-tabs-header')) {
      headerWrapper = cn;
    } else if (cn.type === 'tag' && cn.attribs.class.includes('tabs-tabs-container')) {
      tabsContainer = cn;
    }
  }

  if (!headerWrapper || !tabsContainer) {
    return (<p>Error, unable to render TabsComponent. Missing headerWrapper or tabsContainer</p>);
  }

  // Identify all the tabs
  (headerWrapper as Element).childNodes.forEach(cn => {
    if (cn.type === 'tag' && cn.attribs.class.includes('tabs-tab-button')) {
      tabs.push({
        id: cn.attribs['data-id'],
        tabno: Number(cn.attribs['data-tab']),
        text: (cn.children[0].type === 'text') ? cn.children[0].data || '' : '',
      });
    }
  });

  // Get all the content divs
  (tabsContainer as Element).childNodes.forEach(cn => {
    if (cn.type === 'tag' && cn.attribs.class.includes('tabs-tab-content')) {
      contents[cn.attribs['data-id']] = cn.children as DOMNode[];
    }
  });

  return (
    <Tabs defaultValue={tabs[0].id} className='w-full border-2 rounded-lg'>
      <TabsList className='w-full flex flex-row items-start rounded-lg'>{
        tabs.map((tab, index) => (
          <TabsTrigger key={'tab-' + index} value={tab.id}>{tab.text}</TabsTrigger>
        ))
      }</TabsList>
      {
        Object.entries(contents).map(([id, content], index) => {
          return (
            <TabsContent
              value={id}
              key={id}
              className='p-4 m-0'
            >
              {domToReact(content as DOMNode[])}
            </TabsContent>
          )
        })
      }
    </Tabs>
  );
};

export default TabsComponent;

/*

From markdown-it tabs plugin demo, prerendered using Prerenderer.ts

<div class="tabs-tabs-wrapper" data-id="fruit">
  <div class="tabs-tabs-header">
    <button type="button" class="tabs-tab-button" data-tab="0" data-id="apple">apple</button>
    <button type="button" class="tabs-tab-button" data-tab="1" data-id="banana">banana</button>
  </div>
  <div class="tabs-tabs-container">
    <div class="tabs-tab-content" data-index="0" data-id="apple">
      <p>Apple</p>
    </div>
    <div class="tabs-tab-content" data-index="1" data-id="banana">
      <p>Banana</p>
    </div>
  </div>
</div>

 */