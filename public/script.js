function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function fetchData() {
    fetch('/data')
        .then(res => res.json())
        .then(data => {
            document.getElementById('data-box').innerText = data.data;
        });
}

window.onload = () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark');
    }
};

