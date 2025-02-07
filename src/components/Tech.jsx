import React from "react";

import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = ({ isVisible = true }) => {
  if (!isVisible) return null;

  return (
    <div className='flex flex-row flex-wrap justify-center gap-10'>
      {technologies.map((technology) => (
        <div className='w-28 h-28' key={technology.name}>
          <BallCanvas icon={technology.icon} />
        </div>
      ))}
    </div>
  );
};

// SectionWrapperにisVisibleを渡すように修正
const WrappedTech = (props) => {
  if (!props.isVisible) return null;
  return <Tech {...props} />;
};

export default SectionWrapper(WrappedTech, "");
