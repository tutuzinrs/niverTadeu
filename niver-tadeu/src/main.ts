import './style.css'

// Splash Screen Logic
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      splash.classList.add('hide'); // Triggers CSS pull-up transition
      setTimeout(() => {
        splash.style.display = 'none';
      }, 800); // Matches the 0.8s CSS transition
    }
  }, 2300); // Waits for webs to shoot (1.2s delay max + 0.5s anim + leeway)
});
// Placeholder for scrolling down when "DESLIZE" is clicked
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
});

// Smooth scroll for navbar links
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const href = link.getAttribute('href');
    if (href) {
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Animation: Fade in on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Optional: stop observing once it has become visible
      // revealObserver.unobserve(entry.target);
    }
  });
}, {
  rootMargin: "0px 0px -50px 0px", // triggers slightly before it hits the bottom
  threshold: 0.1
});

const elementsToReveal = document.querySelectorAll('.reveal');
elementsToReveal.forEach((el) => {
  revealObserver.observe(el);
});

// WhatsApp RSVP Dynamic Logic
const radios = document.querySelectorAll('input[name="has_companions"]');
const companionsSection = document.getElementById('companions-section');
const companionsContainer = document.getElementById('companions-container');
const addCompanionBtn = document.getElementById('add-companion-btn');
const rsvpForm = document.getElementById('rsvp-form');

if (radios.length && companionsSection && companionsContainer && addCompanionBtn && rsvpForm) {
  // Toggle companions section
  radios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.value === 'sim') {
        companionsSection.style.display = 'flex';
        // Ensure there is at least one input when toggled on
        if (companionsContainer.children.length === 0) {
          addCompanionInput();
        }
      } else {
        companionsSection.style.display = 'none';
        companionsContainer.innerHTML = ''; // reset inputs
      }
    });
  });

  // Atualiza os placeholders para ficarem na ordem correta (1, 2, 3...)
  const updatePlaceholders = () => {
    const inputs = companionsContainer.querySelectorAll('.companion-input');
    inputs.forEach((input, index) => {
      (input as HTMLInputElement).placeholder = `Nome do Acompanhante ${index + 1}`;
    });
  };

  // Action to add an input
  const addCompanionInput = () => {
    const actCount = companionsContainer.querySelectorAll('.companion-input').length + 1;
    
    const row = document.createElement('div');
    row.className = 'companion-row';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Nome do Acompanhante ${actCount}`;
    input.required = true;
    input.className = 'form-input companion-input';
    row.appendChild(input);
    
    // Adiciona botão "Remover" apenas se não for o 1º campo obrigatório
    if (actCount > 1) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-btn';
      removeBtn.innerHTML = '<i class="ph-bold ph-trash"></i>';
      removeBtn.addEventListener('click', () => {
        row.remove();
        updatePlaceholders();
      });
      row.appendChild(removeBtn);
    }

    companionsContainer.appendChild(row);
  };

  addCompanionBtn.addEventListener('click', addCompanionInput);

  // Form submit
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // O número de telefone passado
    const whatsappNumber = "5521993188880"; 
    
    const guestName = (document.getElementById('guest-name') as HTMLInputElement).value;
    const isBringingCompanions = (document.querySelector('input[name="has_companions"]:checked') as HTMLInputElement)?.value === 'sim';
    
    let message = `Olá! Meu nome é *${guestName.trim()}* e estou confirmando minha presença no Niver do Tadeu! 🕷️\n\n`;
    
    if (isBringingCompanions) {
      const companionInputs = Array.from(companionsContainer.querySelectorAll('.companion-input')) as HTMLInputElement[];
      const companionsList = companionInputs.map(i => i.value.trim()).filter(v => v.length > 0);
      
      const companionCount = companionsList.length;
      
      if (companionCount > 0) {
        message += `Estarei levando mais *${companionCount}* acompanhante(s).\n`;
        message += `Nomes:\n`;
        companionsList.forEach((name, index) => {
          message += `${index + 1}. ${name}\n`;
        });
      } else {
        message += `Estarei indo sozinho(a).\n`;
      }
    } else {
      message += `Estarei indo sozinho(a).\n`;
    }
    
    // Url Encode
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open in new tab
    window.open(whatsappUrl, '_blank');
  });
}
