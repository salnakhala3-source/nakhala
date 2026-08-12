// 1. استيراد مكتبات فايربيس الرسمية
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. إعدادات السيرفر الخاصة بمشروعك على Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbYy9vleMCQWPi2a39Fk_8APwKnLMoo9o",
  authDomain: "nakhala-project.firebaseapp.com",
  projectId: "nakhala-project",
  storageBucket: "nakhala-project.firebasestorage.app",
  messagingSenderId: "158051158867",
  appId: "1:158051158867:web:16b9361221cbe157d96fa6",
  measurementId: "G-CK7EJ54D8M"
};

// 3. تشغيل الاتصال بالسيرفر
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. تسجيل فرد جديد (index.html)
    const familyForm = document.getElementById('familyForm');
    if(familyForm) {
        familyForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const data = {
                "الاسم": document.getElementById('fullName').value,
                "رقم الهاتف": document.getElementById('phone').value,
                "رقم الهوية": document.getElementById('idNumber').value,
                "تاريخ الميلاد": document.getElementById('birthdate').value,
                "الفرع": document.getElementById('branch').value,
                "وقت التسجيل": new Date().toLocaleString()
            };
            
            // حفظ في سيرفر جوجل الحقيقي
            await saveToAdminDatabase('سجل_الأفراد_الجدد', data);
            alert(`أهلاً بك يا ${data["الاسم"]}! تم تسجيل بياناتك بنجاح في السيرفر الرسمي.`);
            familyForm.reset();
        });
    }

    // 2. تفعيل كافة النماذج في الفروع والملتقيات والتكريم
    setupGenericForm('palestineForm', 'فرع_فلسطين');
    setupGenericForm('gulfForm', 'فرع_الخليج');
    setupGenericForm('europeForm', 'فرع_أوروبا');
    setupGenericForm('meetingForm', 'حضور_الملتقى');
    setupGenericForm('honoringForm', 'ترشيحات_التكريم');
});

// دالة تخزين البيانات في سيرفر Firebase الحقيقي
async function saveToAdminDatabase(dbKey, newData) {
    try {
        const docRef = await addDoc(collection(db, dbKey), newData);
        console.log("تم الحفظ في السيرفر بنجاح برقم المعرف: ", docRef.id);
    } catch (e) {
        console.error("خطأ أثناء الحفظ في السيرفر: ", e);
        alert("حدث خطأ أثناء الاتصال بالسيرفر، يرجى المحاولة لاحقاً.");
    }
}

// دالة عامة لربط النماذج وسحب البيانات بناءً على عناوين الحقول
function setupGenericForm(formId, dbKey) {
    const formElement = document.getElementById(formId);
    if(formElement) {
        formElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            const inputs = formElement.querySelectorAll('input, select, textarea');
            let data = { "وقت الإرسال": new Date().toLocaleString() };
            
            inputs.forEach((input, index) => {
                if(input.type !== 'submit' && input.type !== 'button') {
                    let label = input.previousElementSibling ? input.previousElementSibling.innerText : `حقل_${index}`;
                    data[label.replace(':', '')] = input.value;
                }
            });
            
            // حفظ البيانات المرسلة في السيرفر
            await saveToAdminDatabase(dbKey, data);
            alert('تم إرسال وحفظ البيانات في السيرفر الرسمي بنجاح!');
            formElement.reset();
        });
    }
}
