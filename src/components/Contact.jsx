import React from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { slideIn, textVariant } from "../utils/motion";
import { contactContent } from "../constants";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <section className="relative min-h-[80vh] w-full mx-auto">
      <div className="w-full h-full flex flex-col items-center justify-start pt-16">
        <motion.div variants={textVariant()}>
          <p className={`${styles.sectionSubText} text-center`}>
            {contactContent.title}
          </p>
          <h2 className={`${styles.sectionHeadText} text-center mb-5`}>
            {contactContent.subtitle}
          </h2>
        </motion.div>

        <div className="w-full flex flex-col items-center justify-center mt-10">
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Contact, "contact");
