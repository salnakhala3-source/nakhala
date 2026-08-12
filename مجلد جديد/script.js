document.addEventListener('DOMContentLoaded', function() {
    
    // 1. تسجيل فرد جديد (index.html)
    const familyForm = document.getElementById('familyForm');
    if(familyForm) {
        familyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const data = {
                "الاسم": document.getElementById('fullName').value,
                "رقم الهاتف": document.getElementById('phone').value,
                "تاريخ الميلاد": document.getElementById('birthdate').value,
                "الفرع": document.getElementById('branch').value,
                "وقت التسجيل": new Date().toLocaleString()
            };
            saveToAdminDatabase('سجل_الأفراد_الجدد', data);
            alert(`أهلاً بك يا ${data["الاسم"]}! تم تسجيل بياناتك بنجاح في قاعدة البيانات الخاصة.`);
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

// دالة تخزين البيانات في قاعدة البيانات المحلية
function saveToAdminDatabase(dbKey, newData) {
    let existingData = JSON.parse(localStorage.getItem(dbKey)) || [];
    existingData.push(newData);
    localStorage.setItem(dbKey, JSON.stringify(existingData));
}

// دالة عامة لربط النماذج وسحب البيانات بناءً على عناوين الحقول
function setupGenericForm(formId, dbKey) {
    const formElement = document.getElementById(formId);
    if(formElement) {
        formElement.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = formElement.querySelectorAll('input, select, textarea');
            let data = { "وقت الإرسال": new Date().toLocaleString() };
            
            inputs.forEach((input, index) => {
                if(input.type !== 'submit' && input.type !== 'button') {
                    let label = input.previousElementSibling ? input.previousElementSibling.innerText : `حقل_${index}`;
                    data[label.replace(':', '')] = input.value;
                }
            });
            
            saveToAdminDatabase(dbKey, data);
            alert('تم إرسال وحفظ البيانات في قاعدة البيانات بنجاح!');
            formElement.reset();
        });
    }
}