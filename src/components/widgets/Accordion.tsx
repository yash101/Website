import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type AccordionItem = {
  label?: string,
  value?: string,
};

interface AccordionWidgetProps {
  items?: AccordionItem[];
}

const AccordionWidget: React.FC<{ args: any }> = ({ args }) => {
  const props: AccordionWidgetProps = args as AccordionWidgetProps;

  return (
    <Accordion type='single' collapsible>
      {
        props?.items?.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={`item-${index}`}>
            <AccordionTrigger><span dangerouslySetInnerHTML={{ __html: item.label || '' }} /></AccordionTrigger>
            <AccordionContent><span dangerouslySetInnerHTML={{ __html: item.value || '' }} /></AccordionContent>
          </AccordionItem>
        )) || ''
      }
    </Accordion>
  );
};

export default AccordionWidget;
