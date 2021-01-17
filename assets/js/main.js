/*
 * Fluency
 */

; (function () {
  const body = document.body
  const themeSelectorBtn = document.getElementById('theme-selector-button')

  function toggleTheme() {
    body.classList.toggle('theme-light')
    body.classList.toggle('theme-dark')
  }

  themeSelectorBtn.addEventListener('click', function () {
    toggleTheme()
    if (body.classList.contains('theme-dark')) {
      this.querySelector('span').textContent = 'light mode'
      window.localStorage.setItem('theme', 'dark')
    } else {
      this.querySelector('span').textContent = 'dark mode'
      window.localStorage.setItem('theme', 'light')
    }
  })
  codeHelper()
})()

// code helper
function codeHelper() {
  'use strict'

  if (!document.queryCommandSupported('copy')) {
    return
  }

  function flashCopyMessage(el, msg) {
    el.textContent = msg
    setTimeout(function () {
      el.innerHTML = '<i class="flaticon-copy"></i>'
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
    const codeBlock = containerEl.querySelector('.chroma code[data-lang]')

    const helper = document.createElement('div')
    helper.className = 'code-helper'

    const codeLang = document.createElement('span')
    codeLang.className = 'lang'
    codeLang.textContent = codeBlock.getAttribute('data-lang')

    const copyBtn = document.createElement('button')
    copyBtn.className = 'action'
    copyBtn.setAttribute("aria-label", "copy")
    copyBtn.innerHTML = '<i class="flaticon-copy"></i>'

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
