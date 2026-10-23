(function () {
  var form = document.getElementById('anfrage');
  if (!form) return;

  // Weiche: zeigt nur die Fragen zum gewählten Anliegen
  var teile = form.querySelectorAll('.teil');
  function zeigeTeil() {
    var wahl = form.querySelector('input[name="anliegen"]:checked').value;
    teile.forEach(function (t) { t.hidden = t.getAttribute('data-teil') !== wahl; });
  }
  form.querySelectorAll('input[name="anliegen"]').forEach(function (r) { r.addEventListener('change', zeigeTeil); });

  // Regler mit lesbarer Ausgabe
  function regler(id, eins, mehr, null_) {
    var r = document.getElementById(id), o = document.getElementById(id + '-out');
    function upd() {
      var v = +r.value;
      o.textContent = v === 0 ? null_ : v + ' ' + (v === 1 ? eins : mehr) + (+r.max === v ? ' +' : '');
    }
    r.addEventListener('input', upd); upd();
  }
  regler('kaesten', 'Kasten', 'Kästen', 'keine');
  regler('kuebel', 'Kübel', 'Kübel', 'keine');

  // „Sie entscheiden“ schließt andere Farben aus und umgekehrt
  var farben = form.querySelectorAll('input[name="farbe"]');
  farben.forEach(function (f) {
    f.addEventListener('change', function () {
      if (!f.checked) return;
      farben.forEach(function (g) {
        if (g === f) return;
        if (f.value === 'egal' || g.value === 'egal') g.checked = false;
      });
    });
  });

  var fehler = document.getElementById('fehler');
  var kontakt = document.getElementById('kontakt');
  kontakt.addEventListener('input', function () { fehler.textContent = ''; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = kontakt.value.trim();
    var ok = /\S+@\S+\.\S+/.test(v) || v.replace(/\D/g, '').length >= 6;
    if (!ok) {
      fehler.textContent = 'Bitte geben Sie eine Telefonnummer oder E-Mail-Adresse an, damit wir Sie erreichen.';
      kontakt.focus();
      return;
    }
    form.querySelector('.formteil').style.display = 'none';
    var d = document.getElementById('danke');
    d.classList.add('zeigen');
    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('nochmal').addEventListener('click', function () {
    form.reset();
    zeigeTeil();
    document.getElementById('kaesten').dispatchEvent(new Event('input'));
    document.getElementById('kuebel').dispatchEvent(new Event('input'));
    document.getElementById('danke').classList.remove('zeigen');
    form.querySelector('.formteil').style.display = '';
  });

  zeigeTeil();
})();
