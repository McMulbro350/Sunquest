const LESSONS = [
  {
    title: 'What is UV?',
    icon: '☀️',
    body: [
      'Ultraviolet radiation is invisible radiation from the sun.',
      'UVA penetrates deeper into the skin and contributes strongly to skin aging.',
      'UVB is strongly associated with sunburn and directly damages skin-cell DNA.',
      'Both contribute to skin cancer risk.',
    ],
  },
  {
    title: 'What causes a tan?',
    icon: '🌴',
    body: [
      'A tan happens when UV exposure causes skin cells to increase melanin production.',
      'Melanin makes the skin darker.',
      'A tan is therefore evidence that the skin has responded to UV exposure.',
    ],
  },
  {
    title: 'Does a base tan protect you?',
    icon: '🧴',
    body: [
      'Only slightly.',
      'A developed tan provides very little protection from additional UV radiation and should not replace sunscreen.',
    ],
  },
  {
    title: 'Can you tan without burning?',
    icon: '🌊',
    body: [
      'Yes, but avoiding a visible burn does not mean UV damage did not occur.',
      'Skin damage can happen before visible sunburn.',
    ],
  },
  {
    title: 'What is the safest way to look tan?',
    icon: '🧢',
    body: [
      'Sunless tanning products and spray tans can change skin color without intentionally exposing the skin to UV radiation.',
    ],
  },
]

export default function Learn() {
  return (
    <div className="page">
      <h1 className="section-title">📚 Sun School</h1>
      <p className="card-sub mt-8" style={{ marginBottom: 16 }}>
        A few short lessons on what UV actually does to your skin.
      </p>

      <div className="stack gap-12">
        {LESSONS.map((lesson) => (
          <div key={lesson.title} className="card">
            <div className="card-title">
              {lesson.icon} {lesson.title}
            </div>
            <div className="stack gap-8">
              {lesson.body.map((line, i) => (
                <p key={i} className="card-sub">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
