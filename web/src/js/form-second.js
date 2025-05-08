function toDateString(year, month, day) {
    if (!year) return '';
    const map = {january:'01',february:'02',march:'03',april:'04',may:'05',june:'06',july:'07',august:'08',september:'09',october:'10',november:'11',december:'12'};
    const mm = map[month] || '01';
    const dd = day.padStart(2, '0') || '01';
    return `${year}-${mm}-${dd}`;
}

document.getElementById('soldier-history-form').addEventListener('submit', function (e) {
    e.preventDefault();

    localStorage.setItem('birth_place', document.getElementById('birth_place').value);

    localStorage.setItem('birth_date', toDateString(
        document.getElementById('birth_year').value,
        document.getElementById('birth_month').value,
        document.getElementById('birth_day').value
    ));

    localStorage.setItem('death_date', toDateString(
        document.getElementById('death_year').value,
        document.getElementById('death_month').value,
        document.getElementById('death_day').value
    ));

    localStorage.setItem('military_rank_id', document.getElementById('rank').selectedIndex);
    localStorage.setItem('military_specialty', document.getElementById('military_specialty').value);

    const years = document.getElementById('service_years').value.split('-');
    localStorage.setItem('enlistment_date', years[0] ? `${years[0]}-01-01` : '');
    localStorage.setItem('discharge_date', years[1] ? `${years[1]}-01-01` : '');

    localStorage.setItem('war_id', document.getElementById('war').value);
    window.location.href = 'form-third.html';
});