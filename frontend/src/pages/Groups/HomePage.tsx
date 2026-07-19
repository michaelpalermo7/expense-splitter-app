import { useNavigate } from "react-router-dom";
import FormButton from "../../components/FormButton";
import GraphicImage from "../../components/GraphicImage";
import Graphic from "../../assets/TravelGraphic.png";
import TextBlock from "../../components/TextBlock";
import ChipLabel from "../../components/ChipLabel";
import HowItWorks from "../../components/HowItWorks";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center px-8 py-5">
      <h1 className="w-full text-3xl md:text-4xl font-quicksand font-bold text-[#000000] leading-tight mb-6">
        Whooo paid who? We’ll keep track.
      </h1>

      <GraphicImage src={Graphic} alt="illustration" />

      <div className="mt-6">
        <TextBlock>
          Split, track, and settle — a smarter way to share expenses and skip
          the awkwardness.
        </TextBlock>
      </div>

      <div className="mt-6 w-full">
        <FormButton
          label="Get Started"
          onClick={() => navigate("/add-group")}
        />
      </div>

      <div className="w-full mb-6 mt-16">
        <h3 className="text-xl font-semibold text-black font-quicksand">
          For all types of group events
        </h3>
        <div className="flex justify-center flex-wrap gap-2 mt-4">
          <ChipLabel label="#WeekendTrips" />
          <ChipLabel label="#DinnerNights" />
          <ChipLabel label="#SharedBills" />
          <ChipLabel label="#GroceryRuns" />
        </div>
      </div>

      <div>
        <HowItWorks></HowItWorks>
      </div>

      <div className="mt-6 w-full">
        <FormButton
          label="Get Started"
          onClick={() => navigate("/add-group")}
        />
      </div>
    </div>
  );
};

export default HomePage;
