import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import Select from '../components/Select'
import { useApp } from '../context/AppContext'
import { OTHER_SERVICE, serviceOptions } from '../data/services'
import site, { whatsappLink } from '../data/site'
import { buildEnquiryMessage, buildEnquiryUrl, formatPhone, normalisePhone } from '../lib/whatsapp'

const EMPTY = { name: '', phone: '', service: '', serviceOther: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell me your name.'
  else if (values.name.trim().length < 2) errors.name = 'That looks a little short.'

  if (!values.phone.trim()) errors.phone = 'I need a number to call you back on.'
  else if (values.phone.length < 10) errors.phone = 'That is only ' + values.phone.length + ' digits, I need 10.'
  else if (!normalisePhone(values.phone))
    errors.phone = 'Indian mobile numbers start with 6, 7, 8 or 9.'

  if (!values.service) errors.service = 'Pick the service you need.'
  else if (values.service === OTHER_SERVICE && !values.serviceOther.trim())
    errors.serviceOther = 'Tell me in a few words what you need.'

  return errors
}

/** What goes out on WhatsApp: the picked service, or whatever was typed. */
function serviceOf(values) {
  return values.service === OTHER_SERVICE ? values.serviceOther.trim() : values.service
}

/* ---------------------------------------------------------------- field */
function Field({ id, label, error, children, hint, optional, n }) {
  return (
    <div className="relative">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="flex items-baseline gap-2.5 text-[13px] font-medium text-white/90">
          {n && <span className="font-mono text-[11px] tabular-nums text-blue-glow/55">{n}</span>}
          {label}
          {optional && <span className="ml-1.5 text-[11px] font-normal text-muted">optional</span>}
        </label>
        {hint && <span className="text-[11px] text-muted">{hint}</span>}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={id + '-error'}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#FF8080]"
          >
            <Icon name="close" size={13} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* 16px is not a taste call. Safari on iOS zooms the viewport in when you
   focus a field whose font-size is under 16px, and it does not zoom back out,
   so the page is left scaled and scrolled sideways for the rest of the visit.
   Every real control here is 16px up to sm and the old 15px above it. */
const inputBase =
  'w-full rounded-2xl border bg-white/[0.03] px-4 py-3.5 text-[16px] sm:text-[15px] text-white placeholder:text-muted/60 outline-none transition-all duration-400 ease-premium focus:bg-white/[0.055]'

/* ------------------------------------------------------- brief score */
/* A Lighthouse-style ring. It is the one metric this audience already reads,
   and here it scores the brief instead of a page: the fuller the brief, the
   faster I can quote. */
function ScoreRing({ score }) {
  const R = 17
  const C = 2 * Math.PI * R
  return (
    <span className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center">
      <svg viewBox="0 0 46 46" width="46" height="46" className="-rotate-90">
        <circle cx="23" cy="23" r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="3" />
        <circle
          cx="23"
          cy="23"
          r={R}
          fill="none"
          stroke="url(#score-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C - (C * score) / 100}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)' }}
        />
        <defs>
          <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2D9CFF" />
            <stop offset="100%" stopColor="#0A6CFF" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-mono text-[12px] font-semibold tabular-nums text-white">{score}</span>
    </span>
  )
}

/* Editor chrome. The form is a file you are filling in, which is exactly what
   it is: a brief. */
function BriefChrome({ score }) {
  return (
    <div className="relative mb-6 flex items-center gap-3 border-b border-white/[0.07] pb-4">
      <span aria-hidden="true" className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
      </span>
      <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-muted">
        <span className="text-white/80">project-brief</span>.md
      </span>
      <span className="hidden text-right text-[10.5px] uppercase tracking-[0.16em] text-muted sm:block">
        Brief score
      </span>
      <ScoreRing score={score} />
    </div>
  )
}

/* ----------------------------------------------------- live preview */
/* Everything typed on the left is assembled here, exactly as WhatsApp will
   receive it. Nothing is sent until the button is pressed. */
function LivePreview({ values, ready }) {
  const text = buildEnquiryMessage({
    name: values.name.trim() || '…',
    phone: formatPhone(normalisePhone(values.phone)) || '…',
    service: serviceOf(values) || '…',
    message: values.message,
  })

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4 sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.22),transparent_70%)] blur-2xl"
      />
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[linear-gradient(145deg,#2BE673,#128C4B)]">
          <Icon name="whatsapp" size={15} className="text-white" />
        </span>
        <span className="flex-1 text-[11px] uppercase tracking-[0.16em] text-muted">Live preview</span>
        <span
          className={`flex items-center gap-1.5 text-[11px] transition-colors duration-500 ${
            ready ? 'text-[#2BE673]' : 'text-muted'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
              ready ? 'bg-[#2BE673]' : 'bg-white/25'
            }`}
          />
          {ready ? 'Ready to send' : 'Waiting'}
        </span>
      </div>

      <div className="relative mt-4 rounded-2xl rounded-tl-md border border-white/[0.07] bg-[#0d1b14]/70 p-3.5">
        <pre className="whitespace-pre-wrap break-words font-sans text-[12.5px] leading-[1.65] text-white/80">
          {text}
        </pre>
        <span className="mt-2 block text-right font-mono text-[10px] text-white/35">now</span>
      </div>
    </div>
  )
}

/* --------------------------------------------------------------- cards */
/* Each channel keeps its own brand colour: the icon chip is tinted with it and
   the whole card picks it up on hover, so WhatsApp reads green, Instagram its
   gradient, LinkedIn its blue. */
function ContactCard({ icon, label, value, href, external, brand, fill }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      data-cursor="hover"
      style={{ '--brand': brand }}
      className="group relative block min-w-0 rounded-2xl"
    >
      <div className="glass flex items-center gap-3.5 overflow-hidden rounded-2xl p-4 transition-all duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:border-[color:var(--brand)] group-hover:shadow-[0_14px_36px_-16px_var(--brand)] sm:gap-4">
        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 text-white transition-transform duration-500 ease-premium group-hover:scale-105"
          style={{ background: fill }}
        >
          <Icon name={icon} size={20} className="relative z-10" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] uppercase tracking-[0.16em] text-muted">{label}</span>
          <span className="mt-0.5 block truncate text-[14.5px] font-medium text-white">{value}</span>
        </span>
        <Icon
          name="arrowUpRight"
          size={17}
          className="shrink-0 text-muted transition-all duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--brand)]"
        />
      </div>
    </a>
  )
}

/* ------------------------------------------------------------- section */
export default function Contact() {
  const { selectedService, setSelectedService } = useApp()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [lastUrl, setLastUrl] = useState('')
  const serviceRef = useRef(null)

  /* A service card was clicked elsewhere on the page. */
  useEffect(() => {
    if (!selectedService) return
    setValues((v) => ({ ...v, service: selectedService }))
    setErrors((e) => ({ ...e, service: undefined }))
    const node = serviceRef.current
    if (node) {
      node.classList.add('ring-2', 'ring-blue-main/50', 'ring-offset-4', 'ring-offset-ink-950')
      const t = window.setTimeout(
        () => node.classList.remove('ring-2', 'ring-blue-main/50', 'ring-offset-4', 'ring-offset-ink-950'),
        1800,
      )
      return () => window.clearTimeout(t)
    }
  }, [selectedService])

  const set = (key) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    if (touched[key]) setErrors(validate({ ...values, [key]: value }))
    if (status === 'sent') setStatus('idle')
  }

  /* digits only, hard capped at 10: the field can never hold anything else,
     so nothing has to be stripped later and the counter is always honest */
  const setPhone = (e) => {
    let d = e.target.value.replace(/\D/g, '')
    // a pasted +91 / 0 prefix is dropped rather than eating the real number
    if (d.length > 10 && d.startsWith('91')) d = d.slice(2)
    if (d.length > 10 && d.startsWith('0')) d = d.slice(1)
    const digits = d.slice(0, 10)
    setValues((v) => ({ ...v, phone: digits }))
    if (touched.phone) setErrors(validate({ ...values, phone: digits }))
    if (status === 'sent') setStatus('idle')
  }

  const blur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors(validate(values))
  }

  const pickService = (title) => {
    setSelectedService(title)
    setValues((v) => ({ ...v, service: title }))
    setErrors((e) => ({ ...e, service: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    setTouched({ name: true, phone: true, service: true })

    if (Object.keys(found).length) {
      const first = document.getElementById('field-' + Object.keys(found)[0])
      if (first) first.focus()
      return
    }

    const url = buildEnquiryUrl({
      name: values.name.trim(),
      phone: formatPhone(normalisePhone(values.phone)),
      service: serviceOf(values),
      message: values.message,
    })
    setLastUrl(url)

    // Opened inside the click handler so no popup blocker can swallow it.
    window.open(url, '_blank', 'noopener,noreferrer')

    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 700)
  }

  const reset = () => {
    setValues(EMPTY)
    setErrors({})
    setTouched({})
    setStatus('idle')
    setSelectedService('')
  }

  /* brief completeness, the three required answers carry it, the message tops
     it off. Deliberately never 100 until something useful is written. */
  const score = (() => {
    let n = 0
    if (values.name.trim().length > 1) n += 30
    if (normalisePhone(values.phone)) n += 30
    if (values.service && (values.service !== OTHER_SERVICE || values.serviceOther.trim())) n += 25
    if (values.message.trim().length > 12) n += 15
    else if (values.message.trim()) n += 7
    return n
  })()
  const ready = Object.keys(validate(values)).length === 0

  const contactCards = [
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: 'Chat instantly',
      href: whatsappLink('Hi Akash, I found your website and want to connect.'),
      external: true,
      brand: '#25D366',
      fill: 'linear-gradient(140deg,rgba(37,211,102,0.9),rgba(18,140,70,0.55))',
    },
    {
      icon: 'phone',
      label: 'Call me',
      value: site.phoneDisplay,
      href: 'tel:+' + site.phoneIntl,
      brand: '#2D9CFF',
      fill: 'linear-gradient(140deg,rgba(45,156,255,0.9),rgba(0,75,147,0.6))',
    },
    {
      icon: 'instagram',
      label: 'Instagram',
      value: site.instagramHandle,
      href: site.instagram,
      external: true,
      brand: '#E1306C',
      fill: 'linear-gradient(45deg,#F58529,#DD2A7B 45%,#8134AF 75%,#515BD4)',
    },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      value: site.linkedinHandle,
      href: site.linkedin,
      external: true,
      brand: '#0A66C2',
      fill: 'linear-gradient(140deg,rgba(10,102,194,0.95),rgba(6,64,122,0.6))',
    },
    {
      icon: 'mail',
      label: 'Email',
      value: site.email,
      href: 'mailto:' + site.email,
      brand: '#8AB4F8',
      fill: 'linear-gradient(140deg,rgba(138,180,248,0.75),rgba(45,99,186,0.5))',
    },
  ]

  return (
    <section id="contact" className="section-pad relative z-10">
      <div className="container-x">
        <SectionHeading
          align="center"
          eyebrow="Get in touch"
          lines={[
            'Tell me what you need.',
            { text: 'I will reply on WhatsApp.', node: <span className="text-grad">I will reply on WhatsApp.</span> },
          ]}
          lead="Four answers and your enquiry opens in WhatsApp, already typed. Nothing sits in an inbox waiting for someone to notice it."
        />

        <div className="mt-9 grid gap-5 lg:mt-11 lg:grid-cols-12 lg:gap-6">
          {/* ------------------------------- form ------------------------------- */}
          <Reveal y={30} className="lg:col-span-7">
            <div className="grad-border relative rounded-3xl">
              <div className="glass relative overflow-hidden rounded-3xl p-5 sm:p-7 lg:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.22),transparent_70%)] blur-2xl"
                />

                {status !== 'sent' && <BriefChrome score={score} />}

                <AnimatePresence mode="wait">
                  {status === 'sent' ? (
                    /* ----------------------- success ----------------------- */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="relative flex min-h-[420px] flex-col items-center justify-center py-8 text-center"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.1 }}
                        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-grad text-white shadow-glow-lg"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-blue-main/50"
                          style={{ animation: 'pulse-ring 2.2s cubic-bezier(0.22,1,0.36,1) infinite' }}
                        />
                        <motion.svg
                          viewBox="0 0 24 24"
                          width="34"
                          height="34"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="relative z-10"
                        >
                          <motion.path
                            d="m4.5 12.5 5 5 10-11"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
                          />
                        </motion.svg>
                      </motion.span>

                      <h3 className="mt-7 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                        WhatsApp is opening
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/90">
                        Your enquiry is pre-typed in the chat, just press send. I usually reply within
                        a few hours.
                      </p>

                      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                        <a
                          href={lastUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-blue-grad px-6 py-3 text-sm font-medium text-white shadow-glow transition-shadow hover:shadow-glow-lg"
                        >
                          <Icon name="whatsapp" size={17} />
                          Did not open? Tap here
                        </a>
                        <button
                          type="button"
                          onClick={reset}
                          className="rounded-full border border-white/10 px-6 py-3 text-sm text-muted transition-colors hover:border-white/25 hover:text-white"
                        >
                          Send another
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    /* ------------------------- form ------------------------- */
                    <motion.form
                      key="form"
                      onSubmit={onSubmit}
                      noValidate
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative space-y-5"
                    >
                      <Field id="field-name" n="01" label="Your name" error={touched.name ? errors.name : ''}>
                        <input
                          id="field-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="e.g. Ravi Kumar"
                          value={values.name}
                          onChange={set('name')}
                          onBlur={blur('name')}
                          aria-invalid={Boolean(touched.name && errors.name)}
                          aria-describedby={touched.name && errors.name ? 'field-name-error' : undefined}
                          className={
                            inputBase +
                            (touched.name && errors.name
                              ? ' border-[#FF8080]/50 focus:border-[#FF8080]'
                              : ' border-white/10 focus:border-blue-main/70 focus:shadow-glow')
                          }
                        />
                      </Field>

                      <Field
                        id="field-phone"
                        n="02"
                        label="Phone number"
                        hint="10 digits, no +91"
                        error={touched.phone ? errors.phone : ''}
                      >
                        <div className="relative">
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center gap-2 text-[16px] text-white/90 sm:text-[15px]"
                          >
                            +91
                            <span className="h-4 w-px bg-white/15" />
                          </span>
                          <input
                            id="field-phone"
                            name="phone"
                            type="tel"
                            inputMode="numeric"
                            autoComplete="tel-national"
                            pattern="[6-9][0-9]{9}"
                            placeholder="90479 50974"
                            value={values.phone}
                            onChange={setPhone}
                            onBlur={blur('phone')}
                            aria-invalid={Boolean(touched.phone && errors.phone)}
                            aria-describedby={touched.phone && errors.phone ? 'field-phone-error' : undefined}
                            className={
                              inputBase +
                              ' pl-[4.6rem] tracking-[0.04em]' +
                              (touched.phone && errors.phone
                                ? ' border-[#FF8080]/50 focus:border-[#FF8080]'
                                : ' border-white/10 focus:border-blue-main/70 focus:shadow-glow')
                            }
                          />
                          <span
                            className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[11px] tabular-nums transition-colors duration-300 ${
                              values.phone.length === 10 ? 'text-[#2BE673]' : 'text-muted/70'
                            }`}
                          >
                            {values.phone.length}/10
                          </span>
                        </div>
                      </Field>

                      {/* service, custom dropdown (styled, keyboard accessible) */}
                      <div ref={serviceRef} className="rounded-2xl transition-shadow duration-500">
                        <label
                          htmlFor="field-service"
                          className="mb-2 flex items-baseline gap-2.5 text-[13px] font-medium text-white/90"
                        >
                          <span className="font-mono text-[11px] tabular-nums text-blue-glow/55">03</span>
                          What do you need?
                        </label>
                        <Select
                          id="field-service"
                          name="service"
                          value={values.service}
                          options={serviceOptions}
                          placeholder="Select a service…"
                          invalid={Boolean(touched.service && errors.service)}
                          describedBy={touched.service && errors.service ? 'field-service-error' : undefined}
                          onChange={pickService}
                          onBlur={blur('service')}
                        />

                        <AnimatePresence>
                          {values.service === OTHER_SERVICE && (
                            <motion.div
                              key="other"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3">
                                <label
                                  htmlFor="field-serviceOther"
                                  className="mb-2 flex items-baseline gap-2.5 text-[13px] font-medium text-white/90"
                                >
                                  <span className="font-mono text-[11px] tabular-nums text-blue-glow/55">
                                    03b
                                  </span>
                                  What do you need instead?
                                </label>
                                <input
                                  id="field-serviceOther"
                                  name="serviceOther"
                                  type="text"
                                  autoComplete="off"
                                  placeholder="e.g. Google Business profile setup"
                                  value={values.serviceOther}
                                  onChange={set('serviceOther')}
                                  onBlur={blur('serviceOther')}
                                  aria-invalid={Boolean(touched.serviceOther && errors.serviceOther)}
                                  className={
                                    inputBase +
                                    (touched.serviceOther && errors.serviceOther
                                      ? ' border-[#FF8080]/50 focus:border-[#FF8080]'
                                      : ' border-white/10 focus:border-blue-main/70 focus:shadow-glow')
                                  }
                                />
                                {touched.serviceOther && errors.serviceOther && (
                                  <p
                                    role="alert"
                                    className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#FF8080]"
                                  >
                                    <Icon name="close" size={13} />
                                    {errors.serviceOther}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          )}

                          {touched.service && errors.service && (
                            <motion.p
                              id="field-service-error"
                              role="alert"
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-[#FF8080]"
                            >
                              <Icon name="close" size={13} />
                              {errors.service}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <Field id="field-message" n="04" label="Message" optional>
                        <textarea
                          id="field-message"
                          name="message"
                          rows={4}
                          placeholder="Anything useful: your business, a deadline, a reference site…"
                          value={values.message}
                          onChange={set('message')}
                          className={inputBase + ' resize-y border-white/10 focus:border-blue-main/70 focus:shadow-glow'}
                        />
                      </Field>

                      <span className="shimmer-wrap mt-1 block w-full">
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        data-cursor="hover"
                        className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-blue-grad px-7 py-4 text-[15px] font-medium text-white shadow-glow transition-all duration-500 ease-premium hover:shadow-glow-lg disabled:cursor-wait disabled:opacity-80"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.3),transparent)] transition-transform duration-[900ms] ease-premium group-hover:translate-x-full"
                        />
                        <span className="relative z-10 inline-flex items-center gap-2.5">
                          {status === 'sending' ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Opening WhatsApp…
                            </>
                          ) : (
                            <>
                              Send on WhatsApp
                              <Icon
                                name="whatsapp"
                                size={18}
                                className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5"
                              />
                            </>
                          )}
                        </span>
                      </button>
                      </span>

                      <p className="text-center text-[12px] leading-relaxed text-muted">
                        No database, no mailing list. Send just opens WhatsApp with your details ready
                        to go, and you can edit the message before it leaves.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>

          {/* --------------------------- direct contact --------------------------- */}
          <div className="lg:col-span-5">
            <Reveal y={30} className="mb-3">
              <LivePreview values={values} ready={ready} />
            </Reveal>

            <RevealGroup className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1" stagger={0.08}>
              {contactCards.map((card) => (
                <RevealItem key={card.label} className="min-w-0">
                  <ContactCard {...card} />
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  )
}
