import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn, textVariant } from "../utils/motion";
import { contactContent } from "../constants";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    type: "",
    company: "",
    name: "",
    nameKana: "",
    phone: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { target } = e;
    const { name, value } = target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_name_kana: form.nameKana,
          company_name: form.company,
          phone_number: form.phone,
          to_name: "JavaScript Mastery",
          from_email: form.email,
          to_email: "sujata@jsmastery.pro",
          message: form.message,
          inquiry_type: form.type,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert(contactContent.alerts.success);

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert(contactContent.alerts.error);
        }
      );
  };

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

      <div className="mt-20 flex items-center justify-center">
        <div className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex xl:flex-row flex-col-reverse gap-10`}>
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className='flex-[0.85] bg-black-100 p-8 rounded-2xl'
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className='mt-4 flex flex-col gap-8'
            >
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.type.label}
                </span>
                <select
                  name='type'
                  value={form.type}
                  onChange={handleChange}
                  required
                  className='bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-none font-medium'
                >
                  <option value="" disabled>
                    {contactContent.form.type.placeholder}
                  </option>
                  {contactContent.form.type.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>{contactContent.form.company.label}</span>
                <input
                  type='text'
                  name='company'
                  value={form.company}
                  onChange={handleChange}
                  placeholder={contactContent.form.company.placeholder}
                  className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>{contactContent.form.name.label}</span>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  placeholder={contactContent.form.name.placeholder}
                  className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>{contactContent.form.nameKana.label}</span>
                <input
                  type='text'
                  name='nameKana'
                  value={form.nameKana}
                  onChange={handleChange}
                  placeholder={contactContent.form.nameKana.placeholder}
                  className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>{contactContent.form.phone.label}</span>
                <input
                  type='tel'
                  name='phone'
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={contactContent.form.phone.placeholder}
                  className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>{contactContent.form.email.label}</span>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  placeholder={contactContent.form.email.placeholder}
                  className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>{contactContent.form.message.label}</span>
                <textarea
                  rows={7}
                  name='message'
                  value={form.message}
                  onChange={handleChange}
                  placeholder={contactContent.form.message.placeholder}
                  className='bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium'
                />
              </label>

              <button
                type='submit'
                className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary'
              >
                {loading ? contactContent.form.button.sending : contactContent.form.button.default}
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className='xl:flex-1 xl:h-[600px] lg:h-[550px] md:h-[500px] h-[350px]'
          >
            <EarthCanvas />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
