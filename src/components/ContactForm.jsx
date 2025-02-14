import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { contactContent } from "../constants";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasReadPrivacyPolicy, setHasReadPrivacyPolicy] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
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

  const handleModalClose = () => {
    if (hasScrolledToBottom) {
      setIsModalOpen(false);
      setHasReadPrivacyPolicy(true);
      setValue('privacy', true);
      setHasScrolledToBottom(false);
    }
  };

  const handlePrivacyChange = (e) => {
    if (!hasReadPrivacyPolicy) {
      e.preventDefault();
      setValue('privacy', false);
      setIsModalOpen(true);
    }
  };

  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - (scrollTop + clientHeight) < 20) {
      setHasScrolledToBottom(true);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await fetch(import.meta.env.VITE_GAS_DEPLOYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        redirect: 'follow',
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert(contactContent.alerts.success);
        reset();
      } else {
        throw new Error(result.message || 'メール送信に失敗しました');
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
      className='flex-[0.85] bg-black-100 p-7 rounded-2xl w-full max-w-xl mx-auto'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-8 max-w-xl mx-auto'
      >
        <div className='flex flex-col sm:flex-row sm:items-start gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.type.label}
            </span>
            <span className="text-red-400">*</span>
          </div>
          <div className='flex-1'>
            <select
              {...register("type", { required: "お問い合わせ種別を選択してください" })}
              aria-invalid={errors.type ? "true" : "false"}
              className={`w-full bg-tertiary py-3 px-4 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
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
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-start gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.company.label}
            </span>
          </div>
          <div className='flex-1'>
            <input
              type='text'
              {...register("company", {
                maxLength: {
                  value: 100,
                  message: "会社名/組織名は100文字以内で入力してください"
                }
              })}
              aria-invalid={errors.company ? "true" : "false"}
              placeholder={contactContent.form.company.placeholder}
              className={`w-full bg-tertiary py-3 px-4 placeholder:text-secondary/70 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
                ${errors.company ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.company && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.company.message}
              </p>
            )}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-start gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.name.label}
            </span>
            <span className="text-red-400">*</span>
          </div>
          <div className='flex-1'>
            <input
              type='text'
              {...register("name", {
                required: "お名前を入力してください",
                maxLength: {
                  value: 50,
                  message: "お名前は50文字以内で入力してください"
                }
              })}
              aria-invalid={errors.name ? "true" : "false"}
              placeholder={contactContent.form.name.placeholder}
              className={`w-full bg-tertiary py-3 px-4 placeholder:text-secondary/70 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
                ${errors.name ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-start gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.nameKana.label}
            </span>
            <span className="text-red-400">*</span>
          </div>
          <div className='flex-1'>
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
              aria-invalid={errors.nameKana ? "true" : "false"}
              placeholder={contactContent.form.nameKana.placeholder}
              className={`w-full bg-tertiary py-3 px-4 placeholder:text-secondary/70 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
                ${errors.nameKana ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.nameKana && <p className="text-red-400 text-sm mt-1">{errors.nameKana.message}</p>}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-start gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.phone.label}
            </span>
            <span className="text-red-400">*</span>
          </div>
          <div className='flex-1'>
            <input
              type='tel'
              {...register("phone", {
                required: "電話番号を入力してください",
                pattern: {
                  value: /^0[0-9]{9,10}$/,
                  message: "正しい電話番号の形式で入力してください（例：03-1234-5678）"
                }
              })}
              aria-invalid={errors.phone ? "true" : "false"}
              placeholder={contactContent.form.phone.placeholder}
              className={`w-full bg-tertiary py-3 px-4 placeholder:text-secondary/70 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
                ${errors.phone ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row sm:items-start gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.email.label}
            </span>
            <span className="text-red-400">*</span>
          </div>
          <div className='flex-1'>
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
              aria-invalid={errors.email ? "true" : "false"}
              placeholder={contactContent.form.email.placeholder}
              className={`w-full bg-tertiary py-3 px-4 placeholder:text-secondary/70 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
                ${errors.email ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 group'>
          <div className='flex items-center gap-1 w-40 shrink-0 pt-3'>
            <span className='text-white font-medium group-focus-within:text-[#915EFF] transition-colors duration-300'>
              {contactContent.form.message.label}
            </span>
            <span className="text-red-400">*</span>
          </div>
          <div className='flex-1'>
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
              aria-invalid={errors.message ? "true" : "false"}
              placeholder={contactContent.form.message.placeholder}
              className={`w-full bg-tertiary py-3 px-4 placeholder:text-secondary/70 text-white rounded-lg outline-none border-2 font-medium transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:shadow-lg focus:shadow-[#915EFF]/20
                ${errors.message ? 'border-red-400' : 'border-transparent'}`}
            />
            {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>}
          </div>
        </div>

        <div className="space-y-6 sm:ml-40">
          <label className='flex items-start gap-2 cursor-pointer group'>
            <input
              type='checkbox'
              {...register("privacy", {
                required: "プライバシーポリシーへの同意が必要です",
                onChange: handlePrivacyChange
              })}
              disabled={!hasReadPrivacyPolicy}
              aria-invalid={errors.privacy ? "true" : "false"}
              className={`w-4 h-4 mt-0.5 rounded border-2 bg-tertiary text-primary transition-all duration-300 ease-in-out
                hover:border-[#915EFF] focus:border-[#915EFF] focus:ring-2 focus:ring-[#915EFF]/20
                ${errors.privacy ? 'border-red-400' : 'border-tertiary'}
                ${!hasReadPrivacyPolicy ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <span className='text-white text-sm group-hover:text-[#915EFF] transition-colors duration-300'>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className='text-[#915EFF] hover:underline focus:outline-none focus:ring-2 focus:ring-[#915EFF]/20 rounded'
              >
                {contactContent.form.privacy.link}
              </button>
              に同意する
              <span className="text-red-400 ml-1">*</span>
            </span>
          </label>
          {!hasReadPrivacyPolicy && privacy && (
            <p className="text-yellow-400 text-sm mt-1">プライバシーポリシーを確認してください</p>
          )}
          {errors.privacy && <p className="text-red-400 text-sm mt-1">{errors.privacy.message}</p>}

          <div className="flex justify-center mt-12">
            <button
              type='submit'
              disabled={!privacy || loading}
              className={`
                relative bg-white py-4 px-16 rounded-xl outline-none text-gray-800 font-bold shadow-md
                transform transition-all duration-300 ease-in-out overflow-hidden
                ${(!privacy || loading) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100 hover:scale-105 hover:shadow-lg active:scale-95'
                }
              `}
            >
              <span className={`inline-block transition-transform duration-300 ${loading ? 'scale-0' : 'scale-100'}`}>
                {contactContent.form.button.default}
              </span>
              {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      <PrivacyPolicyModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onScroll={handleModalScroll}
        canClose={hasScrolledToBottom}
      />
    </motion.div>
  );
};

export default ContactForm; 