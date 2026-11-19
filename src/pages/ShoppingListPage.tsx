import React, { useState } from 'react';
import { Link } from 'react-router';
import { useMealStore } from '../stores/useMealStore';

export const ShoppingListPage: React.FC = () => {
  const { user, shoppingList, loadShoppingList, toggleShoppingItem, login, clearShoppingList } = useMealStore();
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'clear' | 'finish' | 'incomplete' | null }>({
    isOpen: false,
    type: null,
  });

  const loginExample = () => login('owen@example.com', 'password123');

  // Load shopping list whenever the user changes (always call hooks unconditionally)
  React.useEffect(() => {
    if (user) {
      loadShoppingList(user.id);
    }
  }, [user, loadShoppingList]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center card bg-base-100 p-8 shadow-md border border-base-300 space-y-4">
        <h2 className="text-xl font-bold">รายการซื้อวัตถุดิบ</h2>
        <p className="text-sm text-base-content/70">กรุณาเข้าสู่ระบบก่อนใช้งานรายการซื้อของ</p>
        <button onClick={loginExample} className="btn btn-primary btn-sm mx-auto">
          เข้าสู่ระบบ (ตัวอย่าง)
        </button>
        <Link to="/" className="btn btn-sm btn-outline mt-2">เลือกเมนูอาหาร</Link>
      </div>
    );
  }

  if (shoppingList.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 border border-base-200 rounded-lg space-y-3">
        <h2 className="font-semibold text-base">ไม่มีรายการวัตถุดิบ</h2>
        <p className="text-xs text-base-content/60">
          กรุณาเลือกอาหารเพื่อเพิ่มวัตถุดิบในรายการ
        </p>
        <Link to="/" className="btn btn-sm btn-outline mx-auto">
          เลือกเมนูอาหาร
        </Link>
      </div>
    );
  }

  const toggleCheck = (itemId: string, checked: boolean) => {
    toggleShoppingItem(user.id, itemId, !checked);
  };

  const handleFinishClick = () => {
    const allChecked = shoppingList.every((i) => i.checked);
    if (allChecked) {
      setModalState({ isOpen: true, type: 'finish' });
    } else {
      setModalState({ isOpen: true, type: 'incomplete' });
    }
  };

  const handleConfirmAction = async () => {
    if (modalState.type === 'clear' && user) {
      await clearShoppingList(user.id);
    }
    setModalState({ isOpen: false, type: null });
  };

  return (
    <>
      <div className="max-w-md mx-auto space-y-4 my-6 relative">
        <div className="border border-base-200 rounded-lg p-5 space-y-3">
          <div className="border-b border-base-200 pb-2">
            <span className="text-xs text-base-content/50">รายการซื้อวัตถุดิบ</span>
            <h1 className="font-bold text-base">{shoppingList.length} รายการ</h1>
          </div>

          <div className="space-y-1.5">
            {shoppingList.map((item) => (
              <label
                key={item.itemId}
                className="flex items-center justify-between p-2 rounded hover:bg-base-200/50 cursor-pointer text-xs"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs checkbox-primary"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.itemId, item.checked)}
                  />
                  <span className={item.checked ? 'line-through text-base-content/40' : ''}>
                    {item.ingredientName}{item.measure ? ` (${item.measure})` : ''}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex gap-2 pt-3 border-t border-base-200">
            <button
              onClick={() => setModalState({ isOpen: true, type: 'clear' })}
              className="btn btn-sm btn-outline btn-error flex-1"
            >
              ล้างรายการ
            </button>
            <button
              onClick={handleFinishClick}
              className="btn btn-sm btn-primary flex-1">
              สำเร็จ
            </button>
          </div>
        </div>

        {modalState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-base-100 rounded-xl p-6 max-w-sm w-full shadow-xl border border-base-200 space-y-4 animate-in fade-in zoom-in duration-200 text-center">
              <div>
                <h3 className="font-bold text-lg text-base-content mb-2">
                  {modalState.type === 'clear' && 'ยืนยันการล้างรายการ'}
                  {modalState.type === 'finish' && 'ทำรายการสำเร็จ'}
                  {modalState.type === 'incomplete' && 'ตรวจสอบรายการวัตถุดิบ'}
                </h3>
                <p className="text-sm text-base-content/70">
                  {modalState.type === 'clear' && 'คุณต้องการล้างรายการวัตถุดิบทั้งหมดใช่หรือไม่?'}
                  {modalState.type === 'finish' && 'ซื้อวัตถุดิบสำเร็จเรียบร้อยแล้ว!'}
                  {modalState.type === 'incomplete' && 'คุณยังไม่ได้ทำเครื่องหมายวัตถุดิบทั้งหมด กรุณาตรวจสอบรายการอีกครั้ง'}
                </p>
              </div>

              <div className="flex justify-center gap-4 mt-6">
                {modalState.type === 'clear' ? (
                  <>
                    <button
                      onClick={() => setModalState({ isOpen: false, type: null })}
                      className="btn btn-sm btn-ghost px-6"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmAction}
                      className="btn btn-sm btn-error px-6"
                    >
                      ยืนยัน
                    </button>
                  </>
                ) : (
                  <button
                    onClick={modalState.type === 'incomplete' ? () => setModalState({ isOpen: false, type: null }) : handleConfirmAction}
                    className="btn btn-sm btn-primary px-8"
                  >
                    ตกลง
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
