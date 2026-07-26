import FadeIn from "@/components/FadeIn";
import ProfilePortrait, {
  getProfileImageSrc,
} from "@/components/ProfilePortrait";
import VideoEmbed from "@/components/VideoEmbed";
import books from "@/data/books.json";

const tags = [
  "იურისტი",
  "ისტორიკოსი",
  "მკვლევარი",
  "პოეტი",
  "კომპოზიტორი",
  "პიანისტი",
];

const publishedBook = books[0];

const works: {
  title: string;
  href?: string;
  label?: string;
  cta?: string;
}[] = [
  ...(publishedBook
    ? [
        {
          title: publishedBook.title,
          href: `/wigni/${publishedBook.slug}`,
          label: "წიგნი",
          cta: "წაკითხვა",
        },
      ]
    : []),
  { title: "შუა აზიიდან შიდა ქართლამდე" },
  {
    title: "ლექსებისა და მოთხრობების არაბული მუსიკალური პიესები კრებული",
  },
];

const videos = [
  { id: "aDtYmb3mN2o", title: "ინფორმაცია ნოდარის შესახებ - ვიდეო 1" },
  { id: "ExBSK5ZQZ84", title: "ინფორმაცია ნოდარის შესახებ - ვიდეო 2" },
  { id: "lfWulUfQRfw", title: "ინფორმაცია ნოდარის შესახებ - ვიდეო 3" },
];

const biographyParagraphs = [
  `დაიბადა თბილისში, 2009-2012 წლებში სწავლობდა თბილისის სახელმწიფო უნივერსიტეტში იურიდიულ ფაკულტეტზე. მიღებული ჰქონდა მუსიკალური განათლება. უკრავდა რამდენიმე ინსტრუმენტზე. სტუდენტობის პერიოდში ეწეოდა საზოგადოებრივ საქმიანობას, იყო საზოგადოება "ჰერეთის" აქტიური წევრი, სადაც ქართველი ახალგაზრდები აგროვებდნენ ქართულ წიგნებს და აგზავნიდნენ აზერბაიჯანის ქართულ სკოლებში. ჰქონდა ურთიერთობა თურქ და ირანელ ქართველებთან. პირადად იცნობდა ქართულ-ირანული დედაენის შემქმნელს საიდ მულიანს და ქართულ-თურქული დედაენის შემქმნელს ფარნა ჭილაშვილს.`,
  `2010 წელს ნოდარის აქტივობით თბილისის სამების ტაძარში შედგა საქართველოში მცხოვრები გასიტაშვილების შეკრება, სადაც უწმინდესმა პატრიარქმა დალოცა გასიტაშვილების საგვარეულო.`,
];

export default function HomePage() {
  const profileSrc = getProfileImageSrc();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-8 md:py-16">
      <FadeIn>
        <div className="mb-14 md:mb-16">
          <div className="mb-6 flex justify-center md:float-left md:mb-3 md:mr-8 md:block lg:mr-10">
            <ProfilePortrait src={profileSrc} />
          </div>

          <header className="text-center md:text-left">
            <p className="mb-3 text-sm tracking-wide text-ink-light">
              ბიოგრაფიული ლექსიკონი
            </p>
            <h1 className="font-display text-4xl font-medium leading-tight tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
              ნოდარ გასიტაშვილი
            </h1>
            <p className="mt-3 font-display text-lg text-ink-muted md:text-xl">
              ღვთისაგან გამოგზავნილი ბიჭი
            </p>
            <p className="mt-5 text-sm leading-relaxed text-ink-muted md:text-base">
              დაბადების თარიღი: 28.11.1991
              <br className="hidden md:block" />
              <span className="md:hidden"> - </span>
              გარდაცვალების თარიღი: 19.12.2012
            </p>
            <div className="mt-6 flex flex-col items-center gap-2 md:items-start" aria-label="კატეგორიები">
              <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                {tags.slice(0, 3).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-accent/20 bg-accent-pale px-3 py-1 text-xs text-accent md:text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap justify-center gap-2 md:justify-start">
                {tags.slice(3).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-accent/20 bg-accent-pale px-3 py-1 text-xs text-accent md:text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </header>

          <div className="clear-both" aria-hidden="true" />

          <section className="mt-8 md:mt-10" aria-labelledby="bio-heading">
            <h2
              id="bio-heading"
              className="mb-5 font-display text-2xl font-medium text-ink md:text-3xl"
            >
              ბიოგრაფია
            </h2>
            <div className="space-y-5 text-base leading-[1.85] text-ink-muted md:text-[1.05rem]">
              {biographyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <section className="mb-14 md:mb-16" aria-labelledby="works-heading">
          <h2
            id="works-heading"
            className="mb-6 font-display text-2xl font-medium text-ink md:text-3xl"
          >
            ნაწარმოებები
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => {
              const card = (
                <>
                  <span
                    className="mb-3 block h-px w-8 bg-accent/50"
                    aria-hidden="true"
                  />
                  {work.label && (
                    <p className="mb-2 text-xs uppercase tracking-wide text-ink-light">
                      {work.label}
                    </p>
                  )}
                  <p className="font-display text-lg leading-snug text-ink">
                    {work.title}
                  </p>
                  {work.cta && (
                    <span className="mt-4 inline-flex w-fit items-center rounded-md bg-accent px-3 py-1.5 text-sm text-cream transition-colors group-hover:bg-accent-soft">
                      {work.cta}
                    </span>
                  )}
                </>
              );

              return (
                <li key={work.title}>
                  {work.href ? (
                    <a
                      href={work.href}
                      className="group flex h-full flex-col rounded-xl border border-ink/8 bg-white/50 px-5 py-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-md"
                    >
                      {card}
                    </a>
                  ) : (
                    <div className="flex h-full flex-col rounded-xl border border-ink/8 bg-white/50 px-5 py-6 shadow-sm">
                      {card}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </FadeIn>

      <FadeIn delay={120}>
        <section aria-labelledby="videos-heading">
          <h2
            id="videos-heading"
            className="mb-6 font-display text-2xl font-medium text-ink md:text-3xl"
          >
            ინფორმაცია ნოდარის შესახებ
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoEmbed
                key={video.id}
                videoId={video.id}
                title={video.title}
              />
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
