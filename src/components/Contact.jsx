import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn, textVariant } from "../utils/motion";
import { contactContent } from "../constants";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <div className="relative min-h-screen">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          {contactContent.title}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {contactContent.subtitle}
        </h2>
      </motion.div>

      <div className="mt-20 flex flex-col items-center justify-center gap-10">
        <motion.div
          variants={slideIn("left", "tween", 0.2, 1)}
          className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
        >
          <ContactForm />
        </motion.div>

        <motion.div
          variants={slideIn("up", "tween", 0.2, 1)}
          className='w-full h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px]'
        >
          <EarthCanvas />
        </motion.div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
