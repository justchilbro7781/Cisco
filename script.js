document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.sidebar-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  const linkCards = document.querySelectorAll('.link-card');
  linkCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const name = card.getAttribute('data-name');
      alert(name + ' clicked');
    });
  });
});
