if (typeof document !== 'undefined') {
  const elmt = document.createElement('div');
  elmt.className = 'test-asset';
  elmt.innerText = 'assets work';
  document.body.appendChild(elmt);
}
