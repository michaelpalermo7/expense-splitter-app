import GraphicImage from "./GraphicImage";
import TextBlock from "./TextBlock";
import Step1 from "../assets/Step1.png";
import Step2 from "../assets/Step2.png";
import Step3 from "../assets/Step3.png";
import Step4 from "../assets/Step4.png";

type Step = {
  title: string;
  image: {
    src: string;
    alt: string;
  };
  text: string;
};

const steps: Step[] = [
  {
    title: "Step 1: Create A Group",
    image: { src: Step1, alt: "Choose plan" },
    text: "Add a group name and all members involved (members can be added/removed at any point).",
  },
  {
    title: "Step 2: Share Your Custom Link",
    image: { src: Step2, alt: "Choose plan" },
    text: "Save your generated group link & share with friends. Anyone with this link can see and edit the group's details.",
  },
  {
    title: "Step 3: Add Expenses",
    image: { src: Step3, alt: "Choose plan" },
    text: "When expenses are added, participant balances are automatically adjusted. Splits are done equally accross participants.",
  },
  {
    title: "Step 4: Get Tracking!",
    image: { src: Step4, alt: "Choose plan" },
    text: "The group dashboard allows view of current expenses, unpaid balances and settlement history.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12  flex flex-col items-center space-y-10 px-6">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center space-y-4 w-full max-w-md"
        >
          <h3 className="text-xl font-semibold text-black font-quicksand">
            {step.title}
          </h3>
          <GraphicImage src={step.image.src} alt={step.image.alt} />
          <TextBlock>{step.text}</TextBlock>
        </div>
      ))}
    </section>
  );
}
