import React from "react";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { contactContent } from "../constants";
import ContactForm from "./ContactForm";

const Contact = () => {
  return (
    <section className="relative min-h-[80vh] w-full mx-auto -mt-16">
      <div className="w-full h-full flex flex-col items-center justify-start pt-8">
        <div>
          <p className={`${styles.sectionSubText} text-center`}>
            {contactContent.title}
          </p>
          <h2 className={`${styles.sectionHeadText} text-center mb-5`}>
            {contactContent.subtitle}
          </h2>
        </div>

        <div className="w-full flex flex-col items-center justify-center -mt-4">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper(Contact, "contact");
