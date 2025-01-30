

document.addEventListener('DOMContentLoaded', () => {
    // Add icon interactions
    document.querySelectorAll('.icon-link').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Clicked: ${icon.querySelector('img').alt}`);
            // Add actual functionality here
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('.table-header div');
    
    headers.forEach(header => {
        header.addEventListener('click', function() {
            console.log(`Clicked on ${this.textContent}`);
        });
    });
});


