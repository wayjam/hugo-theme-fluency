/*
 * Fluency
 */

let FluencyCopyIcon = ''
const preferDarkScheme = window.matchMedia('(prefers-color-scheme: dark)')

// code helper
function codeHelper() {
  'use strict'

  if (!document.queryCommandSupported('copy')) {
    return
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg
    setTimeout(function () {
      el.innerHTML = `${FluencyCopyIcon}`
    }, 1000)
  }

  function selectText(node) {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
    return selection
  }

  function addCopyButton(containerEl) {
    const codeBlock = containerEl.querySelector('code[data-lang]')

    if (!codeBlock) {
      return
    }

    const helper = document.createElement('div')
    helper.className = 'code-helper'

    const codeLang = document.createElement('span')
    codeLang.className = 'lang'
    codeLang.textContent = codeBlock.getAttribute('data-lang')

    const copyBtn = document.createElement('button')
    copyBtn.className = 'action'
    copyBtn.setAttribute('aria-label', 'copy')
    copyBtn.innerHTML = `${FluencyCopyIcon}`

    helper.appendChild(codeLang)
    helper.appendChild(copyBtn)

    const codeEl = containerEl.firstElementChild
    copyBtn.addEventListener('click', function () {
      try {
        const selection = selectText(codeEl)
        document.execCommand('copy')
        selection.removeAllRanges()

        flashCopyMessage(copyBtn, 'Copied')
      } catch (e) {
        console && console.log(e)
        flashCopyMessage(copyBtn, "Failed :'(")
      }
    })

    containerEl.insertBefore(helper, codeEl)
  }

  // Add copy button to code blocks
  const highlightBlocks = document.querySelectorAll('.post.single div.highlight')
  Array.prototype.forEach.call(highlightBlocks, addCopyButton)
}

// detect system prefered color
function isDarkMode() {
  return preferDarkScheme.matches
}

; (function () {
  const body = document.body
  const themeSelectorBtn = document.getElementById('theme-selector-button')
  const menuToggler = document.getElementById('navbar-toggler')
  const navbar = document.querySelector('nav.navbar')
  FluencyCopyIcon = (window.FluencyCopyIcon || FluencyCopyIcon).trim()

  themeSelectorBtn.addEventListener('click', function () {
    let theme
    if (isDarkMode()) {
      body.classList.remove('theme-dark')
      body.classList.toggle('theme-light')
      theme = body.classList.contains('theme-light') ? 'light' : 'dark'
    } else {
      body.classList.remove('theme-light')
      body.classList.toggle('theme-dark')
      theme = body.classList.contains('theme-dark') ? 'dark' : 'light'
    }

    window.localStorage.setItem('theme', theme)
  })

  menuToggler.addEventListener('click', function () {
    navbar.classList.toggle('active')
  })

  codeHelper()
})()
