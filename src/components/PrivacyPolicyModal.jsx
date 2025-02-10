import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-tertiary rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-y-auto relative"
        >
          {/* ヘッダー */}
          <div className="sticky top-0 bg-tertiary p-6 border-b border-gray-600">
            <h2 className="text-2xl font-bold text-white">プライバシーポリシー</h2>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {/* コンテンツ */}
          <div className="p-6 text-gray-200">
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">1. 個人情報の取り扱いについて</h3>
              <p className="mb-4">
                ORCX株式会社（以下「当社」）は、お客様の個人情報保護の重要性を認識し、
                適切な管理・保護に努めます。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">2. 収集する個人情報</h3>
              <p className="mb-4">
                当社は、お問い合わせやサービスのご利用に際して、以下の個人情報を収集することがあります：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>氏名</li>
                <li>メールアドレス</li>
                <li>電話番号</li>
                <li>会社名・組織名</li>
                <li>その他、お問い合わせ内容に含まれる個人情報</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">3. 個人情報の利用目的</h3>
              <p className="mb-4">収集した個人情報は、以下の目的で利用いたします：</p>
              <ul className="list-disc pl-6 mb-4">
                <li>お問い合わせへの回答</li>
                <li>サービスに関する情報提供</li>
                <li>サービスの品質向上</li>
                <li>法令に基づく対応</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">4. 個人情報の第三者提供</h3>
              <p className="mb-4">
                当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供いたしません：
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要な場合</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要な場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">5. 個人情報の安全管理</h3>
              <p className="mb-4">
                当社は、個人情報の漏洩、滅失、毀損等を防止するため、適切な安全管理措置を講じます。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">6. お問い合わせ窓口</h3>
              <p className="mb-4">
                個人情報の取り扱いに関するお問い合わせは、以下の窓口までご連絡ください：
              </p>
              <p>
                ORCX株式会社 個人情報保護担当<br />
                メールアドレス：privacy@orcx.co.jp
              </p>
            </section>
          </div>

          {/* フッター */}
          <div className="sticky bottom-0 bg-tertiary p-6 border-t border-gray-600">
            <button
              onClick={onClose}
              className="w-full bg-[#915EFF] text-white py-2 px-4 rounded-lg hover:bg-[#804ee0] transition-colors"
            >
              閉じる
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal; 