import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

function DescripcionInfo() {
  return (
    <div className="mt-5 w-full">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">Descripcion</AccordionTrigger>
          <AccordionContent className="text-base">
            Remera lisa en tela micro panal, con detalle bordado en cuello.
            Calce Oversize.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">Talles</AccordionTrigger>
          <AccordionContent className="text-base">
            Remera lisa en tela micro panal, con detalle bordado en cuello.
            Calce Oversize.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg">Devoluciones</AccordionTrigger>
          <AccordionContent className="text-base">
            Remera lisa en tela micro panal, con detalle bordado en cuello.
            Calce Oversize.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
export default DescripcionInfo;
