import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import emailjs from '@emailjs/browser';
import { contactContent } from "../constants";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const ContactForm = () => {
  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      type: "",
      company: "",
      name: "",
      nameKana: "",
      phone: "",
      email: "",
      message: "",
      privacy: false,
    }
  });

  const privacy = watch("privacy");

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      // 管理者向けメール送信
      const adminResult = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          type: data.type,
          company: data.company,
          name: data.name,
          nameKana: data.nameKana,
          phone: data.phone,
          email: data.email,
          message: data.message,
          reply_to: data.email, // 返信先を設定
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      // 入力者向け自動返信メール送信
      const autoReplyResult = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID,
        {
          to_email: data.email,
          to_name: data.name,
          type: data.type,
          company: data.company,
          name: data.name,
          nameKana: data.nameKana,
          phone: data.phone,
          email: data.email,
          message: data.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (adminResult.status === 200 && autoReplyResult.status === 200) {
        alert(contactContent.alerts.success);
        reset();
      } else {
        throw new Error('メール送信に失敗しました');
      }
    } catch (error) {
      console.error(error);
      alert(contactContent.alerts.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className='flex-[0.85] bg-black-100 p-7 rounded-2xl w-full'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 gap-6'
      >
        {/* 左列 */}
        <div className="space-y-6">
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.type.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <select
              {...register("type", { required: "お問い合わせ種別を選択してください" })}
              className={`bg-tertiary py-3 px-4 text-white rounded-lg outline-none border-2 font-medium
                ${errors.type ? 'border-red-400' : 'border-transparent'}`}
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
            {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.company.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <input
              type='text'
              {...register("company", {
                required: "会社名/組織名を入力してください",
                maxLength: {
                  value: 100,
                  message: "会社名/組織名は100文字以内で入力してください"
                }
              })}
              placeholder={contactContent.form.company.placeholder}
              className={`bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                ${errors.company ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.company && <p className="text-red-400 text-sm mt-1">{errors.company.message}</p>}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.name.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <input
              type='text'
              {...register("name", {
                required: "お名前を入力してください",
                maxLength: {
                  value: 50,
                  message: "お名前は50文字以内で入力してください"
                }
              })}
              placeholder={contactContent.form.name.placeholder}
              className={`bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                ${errors.name ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.nameKana.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <input
              type='text'
              {...register("nameKana", {
                required: "フリガナを入力してください",
                pattern: {
                  value: /^[ァ-ヶー\s]+$/,
                  message: "フリガナは全角カタカナで入力してください"
                },
                maxLength: {
                  value: 50,
                  message: "フリガナは50文字以内で入力してください"
                }
              })}
              placeholder={contactContent.form.nameKana.placeholder}
              className={`bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                ${errors.nameKana ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.nameKana && <p className="text-red-400 text-sm mt-1">{errors.nameKana.message}</p>}
          </label>
        </div>

        {/* 右列 */}
        <div className="space-y-6">
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.phone.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <input
              type='tel'
              {...register("phone", {
                required: "電話番号を入力してください",
                pattern: {
                  value: /^0[0-9]{9,10}$/,
                  message: "正しい電話番号の形式で入力してください（例：03-1234-5678）"
                }
              })}
              placeholder={contactContent.form.phone.placeholder}
              className={`bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                ${errors.phone ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.email.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <input
              type='email'
              {...register("email", {
                required: "メールアドレスを入力してください",
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                  message: "正しいメールアドレスの形式で入力してください"
                },
                maxLength: {
                  value: 256,
                  message: "メールアドレスは256文字以内で入力してください"
                }
              })}
              placeholder={contactContent.form.email.placeholder}
              className={`bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                ${errors.email ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </label>

          <label className='flex flex-col'>
            <span className='text-white font-medium mb-3'>
              {contactContent.form.message.label}
              <span className="text-red-400 ml-1">*</span>
            </span>
            <textarea
              rows={6}
              {...register("message", {
                required: "お問い合わせ内容を入力してください",
                minLength: {
                  value: 10,
                  message: "お問い合わせ内容は10文字以上で入力してください"
                },
                maxLength: {
                  value: 1000,
                  message: "お問い合わせ内容は1000文字以内で入力してください"
                }
              })}
              placeholder={contactContent.form.message.placeholder}
              className={`bg-tertiary py-3 px-4 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                ${errors.message ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
          </label>

          <div className="space-y-4">
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='checkbox'
                {...register("privacy", {
                  required: "プライバシーポリシーへの同意が必要です"
                })}
                className={`w-4 h-4 rounded border-2 bg-tertiary text-primary 
                  ${errors.privacy ? 'border-red-400' : 'border-tertiary'}`}
              />
              <span className='text-white text-sm'>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className='text-[#915EFF] hover:underline focus:outline-none'
                >
                  {contactContent.form.privacy.link}
                </button>
                に同意する
                <span className="text-red-400 ml-1">*</span>
              </span>
            </label>
            {errors.privacy && <p className="text-red-400 text-sm mt-1">{errors.privacy.message}</p>}

            <button
              type='submit'
              disabled={!privacy || loading}
              className={`
                bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary
                ${(!privacy || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#915EFF] transition-colors'}
              `}
            >
              {loading ? contactContent.form.button.sending : contactContent.form.button.default}
            </button>
          </div>
        </div>
      </form>

      <PrivacyPolicyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </motion.div>
  );
};

export default ContactForm; 