import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { members } from "../constants";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const MemberCard = ({ member, isExpanded, onClick, isOtherExpanded }) => {
  return (
    <motion.div
      layout
      onClick={() => !isOtherExpanded && onClick()}
      className={`relative ${
        isExpanded 
          ? 'fixed inset-0 z-50 flex items-center justify-center bg-primary/80'
          : 'w-full min-w-[300px] md:min-w-[600px] flex-shrink-0 cursor-pointer px-4'
      }`}
      style={{ pointerEvents: isOtherExpanded ? 'none' : 'auto' }}
    >
      <motion.div
        layout
        className={`bg-[#003973] rounded-2xl overflow-hidden ${
          isExpanded ? 'w-[90%] max-w-4xl h-[80vh]' : 'w-full h-[500px]'
        }`}
      >
        <motion.div
          layout
          className="relative w-full h-full"
        >
          {/* メイン情報 */}
          <motion.div
            layout
            className={`relative ${
              isExpanded ? 'h-full flex flex-col md:flex-row' : 'h-full flex flex-col'
            }`}
          >
            {/* 画像セクション */}
            <motion.div
              layout
              className={`relative ${
                isExpanded ? 'w-full md:w-1/2 h-[300px] md:h-full' : 'w-full h-[300px]'
              }`}
            >
              <motion.img
                layout
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              {!isExpanded && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#003973] to-transparent" />
              )}
            </motion.div>

            {/* 基本情報セクション */}
            <motion.div
              layout
              className={`relative p-6 ${
                isExpanded ? 'w-full md:w-1/2 overflow-y-auto' : 'flex-1'
              }`}
            >
              <motion.h3
                layout
                className="text-white text-[24px] font-bold"
              >
                {member.name}
              </motion.h3>
              <motion.p
                layout
                className="text-secondary text-[16px] mt-1"
              >
                {member.position}
              </motion.p>

              {/* 拡大表示時のみ表示される詳細情報 */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 space-y-6"
                >
                  {/* 経歴 */}
                  <div>
                    <h4 className="text-white text-[18px] font-semibold mb-3">経歴</h4>
                    <ul className="space-y-2">
                      {member.history.map((item, index) => (
                        <li key={index} className="text-secondary text-[14px] flex gap-4">
                          <span className="text-white min-w-[60px]">{item.year}</span>
                          <span>{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* スキル */}
                  <div>
                    <h4 className="text-white text-[18px] font-semibold mb-3">スキル</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#0093E9]/20 rounded-full text-[14px] text-white"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 実績 */}
                  {member.achievements && (
                    <div>
                      <h4 className="text-white text-[18px] font-semibold mb-3">実績</h4>
                      <ul className="space-y-2">
                        {member.achievements.map((achievement, index) => (
                          <li key={index} className="text-secondary text-[14px]">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* 閉じるボタン */}
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <IoCloseOutline className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Member = () => {
  const [expandedId, setExpandedId] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction) => {
    const container = document.getElementById('members-container');
    const scrollAmount = direction === 'left' ? -600 : 600;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>チームメンバー</p>
        <h2 className={styles.sectionHeadText}>Members.</h2>
      </motion.div>

      <div className="mt-20 relative">
        {/* スクロールボタン */}
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <IoIosArrowBack className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <IoIosArrowForward className="w-6 h-6 text-white" />
        </button>

        {/* カードコンテナ */}
        <div
          id="members-container"
          className="overflow-x-auto flex gap-8 pb-4 px-4 snap-x snap-mandatory hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <AnimatePresence>
            {members.map((member, index) => (
              <div key={member.id} className="snap-center">
                <MemberCard
                  member={member}
                  isExpanded={expandedId === member.id}
                  isOtherExpanded={expandedId !== null && expandedId !== member.id}
                  onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                />
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default SectionWrapper(Member, "member");