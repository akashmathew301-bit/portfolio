import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import useReducedMotion from '../hooks/useReducedMotion'

/**
 * Accessible combobox-style dropdown.
 *
 * A native <select> cannot be styled to match the rest of the UI on desktop,
 * so this is a real listbox: arrow keys, Home/End, Enter/Space, Escape,
 * type-ahead, click-outside, and `aria-activedescendant` for screen readers.
 * A hidden native <select> mirrors the value so browser autofill and plain
 * form semantics still work.
 */
export default function Select({
  id,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option…',
  invalid = false,
  describedBy,
}) {
  const reduced = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const rootRef = useRef(null)
  const listRef = useRef(null)
  const buttonRef = useRef(null)
  const typeahead = useRef({ term: '', at: 0 })
  const listId = useId()

  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o))
  const selectedIndex = items.findIndex((o) => o.value === value)
  const selected = items[selectedIndex]

  /* close on outside click */
  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  /* keep the highlighted option scrolled into view */
  useEffect(() => {
    if (!open || highlight < 0 || !listRef.current) return
    const node = listRef.current.children[highlight]
    if (node) node.scrollIntoView({ block: 'nearest' })
  }, [open, highlight])

  const openList = (startAt) => {
    setHighlight(startAt ?? (selectedIndex >= 0 ? selectedIndex : 0))
    setOpen(true)
  }

  const commit = (index) => {
    const option = items[index]
    if (option === undefined) return
    onChange(option.value)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openList()
        else setHighlight((h) => Math.min(items.length - 1, h + 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openList(items.length - 1)
        else setHighlight((h) => Math.max(0, h - 1))
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setHighlight(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setHighlight(items.length - 1)
        }
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open) commit(highlight)
        else openList()
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          setOpen(false)
        }
        break
      case 'Tab':
        setOpen(false)
        break
      default: {
        if (e.key.length !== 1) return
        const now = Date.now()
        const t = typeahead.current
        t.term = now - t.at > 700 ? e.key : t.term + e.key
        t.at = now
        const found = items.findIndex((o) => o.label.toLowerCase().startsWith(t.term.toLowerCase()))
        if (found >= 0) {
          if (open) setHighlight(found)
          else onChange(items[found].value)
        }
      }
    }
  }

  return (
    <div ref={rootRef} className="relative">
      {/* mirrors the value for autofill + non-JS form semantics */}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      >
        <option value="">{placeholder}</option>
        {items.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        id={id}
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && highlight >= 0 ? `${listId}-opt-${highlight}` : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        data-cursor="hover"
        className={`flex w-full items-center justify-between gap-3 rounded-2xl border bg-white/[0.03] px-4 py-3.5 text-left text-[15px] outline-none transition-all duration-400 ease-premium hover:bg-white/[0.05] ${
          invalid
            ? 'border-[#FF8080]/50 focus-visible:border-[#FF8080]'
            : open
              ? 'border-blue-main/70 bg-white/[0.055] shadow-glow'
              : 'border-white/10 focus-visible:border-blue-main/70 focus-visible:shadow-glow'
        }`}
      >
        <span className="flex min-w-0 items-center gap-3">
          {selected?.icon && (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-blue-main/30 bg-blue-main/15 text-blue-glow">
              <Icon name={selected.icon} size={15} />
            </span>
          )}
          <span className={`truncate ${value ? 'text-white' : 'text-muted/60'}`}>
            {selected?.label || placeholder}
          </span>
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={open ? 'text-blue-glow' : 'text-muted'}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 origin-top overflow-hidden rounded-2xl border border-white/12 bg-ink-950/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.95)] backdrop-blur-xl"
          >
            <ul
              id={listId}
              ref={listRef}
              role="listbox"
              aria-label="Service"
              className="no-scrollbar max-h-[264px] overflow-y-auto p-1.5"
            >
              {items.map((option, i) => {
                const isSelected = option.value === value
                const isActive = i === highlight
                return (
                  <li
                    key={option.value}
                    id={`${listId}-opt-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlight(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(i)}
                    className={`relative flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-[14px] transition-colors duration-200 ${
                      isActive ? 'bg-blue-main/15 text-white' : 'text-muted hover:text-white'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300 ${
                          isSelected || isActive
                            ? 'border-blue-main/40 bg-blue-main/20 text-blue-glow'
                            : 'border-white/10 bg-white/[0.04] text-muted'
                        }`}
                      >
                        <Icon name={option.icon} size={14} />
                      </span>
                      <span className="truncate">{option.label}</span>
                    </span>
                    {isSelected && <Icon name="check" size={15} className="shrink-0 text-blue-glow" />}
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
