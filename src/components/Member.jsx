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
          : 'w-full h-full cursor-pointer'
      }`}
      style={{ pointerEvents: isOtherExpanded ? 'none' : 'auto' }}
    >
      <motion.div
        layout
        className={`bg-[#003973] ${
          isExpanded ? 'w-[90%] max-w-4xl h-[80vh] rounded-3xl' : 'w-full h-full aspect-square rounded-full'
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
                isExpanded ? 'w-full md:w-1/2 h-[300px] md:h-full rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden' 
                : 'w-full h-full rounded-full overflow-hidden'
              }`}
            >
              <motion.img
                layout
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
              {!isExpanded && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#003973] via-[#003973]/50 to-transparent" />
              )}
            </motion.div>

            {/* 基本情報セクション */}
            <motion.div
              layout
              className={`relative ${
                isExpanded 
                  ? 'w-full md:w-1/2 p-6 overflow-y-auto' 
                  : 'absolute bottom-0 left-0 right-0 p-4 text-center'
              }`}
            >
              <motion.h3
                layout
                className={`text-white font-bold ${
                  isExpanded ? 'text-[24px]' : 'text-[18px]'
                }`}
              >
                {member.name}
              </motion.h3>
              <motion.p
                layout
                className={`text-secondary ${
                  isExpanded ? 'text-[16px] mt-2' : 'text-[14px] mt-1'
                }`}
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
                  {member.achievements && member.achievements.length > 0 && (
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
    const scrollAmount = direction === 'left' ? -300 : 300;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-[#80d0c7]`}>チームメンバー</p>
        <h2 className={styles.sectionHeadText}>Members</h2>
      </motion.div>

      <div className="mt-20 relative px-4">
        {/* カードコンテナ */}
        <div
          id="members-container"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 pb-4"
        >
          <AnimatePresence>
            {members.map((member, index) => (
              <div 
                key={member.id} 
                className="w-full aspect-square max-w-[280px] mx-auto sm:max-w-none"
              >
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