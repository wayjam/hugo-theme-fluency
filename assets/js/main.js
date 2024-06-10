/*
 * Fluency
 */
'use strict'

// Use a more descriptive variable name.
const copyIcon = (window.FluencyCopyIcon || '').trim()

// Function to toggle the visibility of the copy message.
function flashCopyMessage(button, message) {
  const originalContent = button.innerHTML
  button.textContent = message
  setTimeout(() => {
    button.innerHTML = originalContent
  }, 1000)
}

// Function to add a copy button to a code block.
function addCopyButton(codeBlock) {
  const container = codeBlock.querySelector('code[data-lang]')
  if (!container) {
    return
  }
  const helper = document.createElement('div')
  helper.className = 'code-helper'

  const codeLang = document.createElement('span')
  codeLang.className = 'lang'
  codeLang.textContent = container.dataset.lang

  const copyBtn = document.createElement('button')
  copyBtn.className = 'action'
  copyBtn.setAttribute('aria-label', 'copy')
  copyBtn.innerHTML = copyIcon

  helper.appendChild(codeLang)
  helper.appendChild(copyBtn)

  copyBtn.addEventListener('click', () => {
    navigator.clipboard
      .writeText(container.textContent)
      .then(() => {
        flashCopyMessage(copyBtn, 'Copied!')
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
        flashCopyMessage(copyBtn, "Failed :'(")
      })
  })

  codeBlock.insertBefore(helper, codeBlock.firstElementChild)
}

// Function to toggle the theme.
function toggleTheme(event) {
  const body = document.body
  const preferDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches

  let theme = 'light'
  if (event) {
    // MediaQueryListEvent
    if (event.type === 'change') {
      theme = preferDarkScheme ? 'dark' : 'light'
    } else {
      // PointerEvent
      theme = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'
    }
  } else {
    theme = localStorage.getItem('theme') || (preferDarkScheme ? 'dark' : 'light')
  }

  body.classList.remove('theme-dark', 'theme-light')
  body.classList.add(`theme-${theme}`)
  localStorage.setItem('theme', theme)
}

// Event listener for the theme selector button.
document.getElementById('theme-selector-button').addEventListener('click', toggleTheme)

// Event listener for the theme selector button.
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleTheme)

// Event listener for the menu toggler.
const menuToggler = document.getElementById('navbar-toggler')
const navbar = document.querySelector('nav.navbar')
menuToggler.addEventListener('click', () => {
  navbar.classList.toggle('active')
})

// Add copy buttons to all code blocks on page load.
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme based on user preference or system settings.
  toggleTheme()

  if (navigator.clipboard) {
    const codeBlocks = document.querySelectorAll('.post.single div.highlight')
    codeBlocks.forEach(addCopyButton)
  }
})
