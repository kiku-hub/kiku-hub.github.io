import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PrivacyPolicyModal = ({ isOpen, onClose, onScroll, canClose }) => {
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
          className="bg-tertiary rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden relative"
        >
          {/* ヘッダー */}
          <div className="sticky top-0 bg-tertiary p-6 border-b border-gray-600 z-10">
            <h2 className="text-2xl font-bold text-white">プライバシーポリシー</h2>
          </div>

          {/* スクロール可能なコンテンツ */}
          <div 
            className="p-6 text-gray-200 overflow-y-auto max-h-[calc(80vh-180px)]"
            onScroll={onScroll}
          >
            <p className="mb-6">
              ORCX株式会社（以下、「当社」といいます。）は、当社ウェブサイトの問い合わせフォーム（以下、「本フォーム」といいます。）をご利用いただく方（以下、「ユーザー」といいます。）から取得する個人情報の取り扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。<br />
              ユーザーは、本フォームを送信することで、本ポリシーの内容に同意したものとみなします。
            </p>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第1条（個人情報の定義）</h3>
              <p>
                本ポリシーにおいて「個人情報」とは、生存する個人に関する情報であり、氏名、住所、電話番号、メールアドレス、その他特定の個人を識別し得る情報、または個人識別符号が含まれる情報をいいます。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第2条（個人情報の取得方法）</h3>
              <p className="mb-4">当社は、本フォームを通じてユーザーに関する以下の情報を取得する場合があります。</p>
              <ul className="list-decimal pl-6">
                <li>氏名</li>
                <li>会社名・団体名</li>
                <li>電話番号</li>
                <li>メールアドレス</li>
                <li>お問い合わせ内容</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第3条（個人情報の利用目的）</h3>
              <p className="mb-4">当社は、取得した個人情報を以下の目的のために利用します。</p>
              <ul className="list-decimal pl-6">
                <li>ユーザーからのお問い合わせに対する回答や対応</li>
                <li>当社のサービス、製品、イベント等に関する情報提供</li>
                <li>ユーザーの意見・要望等の把握及びサービス改善のための分析</li>
                <li>個人を特定しない統計データの作成・利用</li>
                <li>法令またはガイドライン等に基づく対応</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第4条（個人情報の第三者提供）</h3>
              <p className="mb-4">当社は、以下の場合を除き、あらかじめユーザーの同意を得ることなく、個人情報を第三者に開示または提供しません。</p>
              <ul className="list-decimal pl-6">
                <li>法令に基づき開示が認められる場合</li>
                <li>ユーザーまたは公衆の生命、身体、財産の保護のために必要がある場合で、ユーザー本人の同意を得ることが困難な場合</li>
                <li>国の機関もしくは地方公共団体、またはその委託を受けた者が法令に定める事務を遂行するうえで協力が必要であり、ユーザー本人の同意を得ることによって当該事務の遂行に支障を及ぼすおそれがある場合</li>
                <li>事業承継に伴い個人情報が提供される場合（合併、会社分割、事業譲渡、その他の事由を含む）</li>
                <li>その他、個人情報保護法ならびに関連法令で認められる場合</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第5条（個人情報の管理）</h3>
              <p className="mb-4">
                当社は、取得した個人情報を適切かつ安全に管理し、個人情報の漏えい、滅失、改ざん、不正アクセス等を防止するために必要かつ適切な安全管理措置を講じます。<br />
                また、当社は、個人情報を取り扱う従業者を必要最小限に限定し、従業者に対して適切な教育・監督を行います。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第6条（個人情報の開示、訂正、利用停止等の手続き）</h3>
              <p className="mb-4">
                ユーザーは、個人情報保護法その他の法令の定めに基づき、当社が保有するユーザー本人の個人情報について、以下の請求を行うことができます。
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>開示請求</li>
                <li>訂正請求</li>
                <li>利用停止または削除請求</li>
                <li>第三者提供記録の開示請求</li>
              </ul>
              <p>
                上記請求を希望される場合は、本ポリシー末尾に記載の「お問い合わせ窓口」へご連絡ください。<br />
                当社は、ユーザー本人からの請求であることを確認のうえ、法令に従い対応いたします。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第7条（クッキー（Cookie）等の利用）</h3>
              <p>
                当社ウェブサイトでは、利便性向上や統計的データ取得のためにクッキーや類似の技術を使用する場合があります。これらの技術により取得する情報には、特定の個人を識別する情報は含まれませんが、閲覧ページや利用環境などの情報が含まれる場合があります。クッキーの受け取りを拒否したい場合は、ブラウザの設定を変更することで可能ですが、その場合、一部サービスをご利用いただけない可能性があります。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第8条（プライバシーポリシーの変更）</h3>
              <p>
                当社は、法令の改正や当社の事業内容の変更等に伴い、本ポリシーを変更する場合があります。内容を変更した場合には、当社ウェブサイト上に公表する方法によりユーザーに通知し、公表後にユーザーが本フォームを利用した時点で、新たなプライバシーポリシーに同意したものとみなします。
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">第9条（お問い合わせ窓口）</h3>
              <p>
                本ポリシーに関するお問い合わせ、または保有個人情報に関する開示請求等のお手続きに関しては、下記までご連絡ください。<br /><br />
                ORCX株式会社<br />
                住所：東京都世田谷区玉川3-20-2 マノア玉川第三ビル 501<br />
                メールアドレス：info@orcx.co.jp<br />
                受付時間：平日9:00～18:00（土日祝および当社指定休業日を除く）
              </p>
            </section>
          </div>

          {/* フッター */}
          <div className="sticky bottom-0 bg-tertiary p-6 border-t border-gray-600">
            <button
              onClick={onClose}
              disabled={!canClose}
              className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-500 
                ${canClose 
                  ? 'bg-white text-gray-800 hover:bg-gray-100 shadow-lg' 
                  : 'bg-white/30 text-gray-400 cursor-not-allowed'}`}
            >
              {canClose ? '閉じる' : 'プライバシーポリシーを最後までお読みください'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal; 