    function base64ToBlob(base64Data, mimeType = 'application/octet-stream') {
        const cleanedBase64 = base64Data.replace(/\s/g, ''); // remove whitespaces or line breaks
        const byteChars = atob(cleanedBase64);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

    document.getElementById('submissionForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const rawPhoto = localStorage.getItem('photo')
    const formDataPhoto = new FormData();
    
    const base64Data = rawPhoto.split(',')[1]; // only if it's a data URL
    const mimeType = "image/png"; // change according to your file
    const blob = base64ToBlob(base64Data, mimeType);
    
    const file = new File([blob], "photo.png", { type: mimeType });
    formDataPhoto.append('photo', file);
    

    const rawData = {
        name: localStorage.getItem('name'),
        surname: localStorage.getItem('surname'),
        patronymic: localStorage.getItem('patronymic'),
        birth_place: localStorage.getItem('birth_place'),
        birth_date: localStorage.getItem('birth_date'),
        death_date: localStorage.getItem('death_date'),
        war_id: localStorage.getItem('war_id'),
        military_rank_id: (localStorage.getItem('military_rank_id') === '0') ? null : localStorage.getItem('military_rank_id'),
        military_specialty: localStorage.getItem('military_specialty'),
        enlistment_date: localStorage.getItem('enlistment_date'),
        discharge_date: localStorage.getItem('discharge_date'),
        additional_information: document.getElementById('additional_information').value
    };
    
    // Remove keys with null, empty, or undefined values
    const filteredData = {};
    for (const [key, value] of Object.entries(rawData)) {
        if (value !== null && value !== undefined && value.trim() !== '') {
            filteredData[key] = value;
        }
    }
    
    // Create URLSearchParams only with valid values
    const params = new URLSearchParams(filteredData);

    // try {
    //     const res = await axios.post('http://127.0.0.1:8000/heroes/', {}, params);
    //     if (res.status === 201 || res.status === 200) {
    //         alert('Данные успешно отправлены!');
    //         localStorage.clear();
    //     }
    // } catch (err) {
    //     console.error('Ошибка при отправке:', err);
    //     alert('Произошла ошибка при отправке данных.');
    // }
    
    try {

        if (formDataPhoto) {
            const response = await axios.post('http://127.0.0.1:8000/heroes/', formDataPhoto, {
                params: params, // query-параметры
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })  
        }

       else {
        const response = await axios.post('http://127.0.0.1:8000/heroes/', 
            {},
            {
              params: params
            }
          );
       }

        localStorage.clear();

    } catch (error) {
        console.error('Ошибка при отправке данных:', error);
        alert('Произошла ошибка при отправке данных. Проверьте консоль для деталей.');
    }
});