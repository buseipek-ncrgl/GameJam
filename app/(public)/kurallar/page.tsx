// app/(public)/kurallar/page.tsx
import PageHeader from "../../panel/_components/page-header";

export default function RulesPage() {
  return (
    <section
      className="
        relative isolate min-h-screen overflow-hidden
        text-white
        bg-gradient-to-br from-slate-950 via-slate-900/50 to-purple-950/30
      "
    >
      {/* Basitleştirilmiş arka plan */}
      <div
        aria-hidden
        className="
          pointer-events-none absolute -z-10 inset-0
          bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10
        "
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-20">
        {/* Hero Section - daha etkileyici */}
        <div className="text-center space-y-6">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-pulse">
              Yarışma Kuralları
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 blur-3xl -z-10"></div>
          </div>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed">
            Game Jam'e katılmak için bilmeniz gereken tüm kurallar ve şartlar
          </p>
        </div>

        {/* Genel Kurallar - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 
            border border-white/20
            shadow-2xl shadow-orange-500/10
            hover:shadow-3xl hover:shadow-orange-500/20
            transition-all duration-500 hover:scale-[1.02]
          "
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Genel Kurallar"
            desc="Yarışmaya katılmak için uyulması gereken temel kurallar"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
            {[
              {
                icon: "👥",
                title: "Takım Kuralları",
                rules: [
                  "Her takım 3-5 kişiden oluşmalıdır",
                  "Takım üyeleri 18 yaşını doldurmuş olmalıdır",
                  "Bir kişi sadece bir takımda yer alabilir",
                  "Takım isimleri uygun olmalıdır"
                ],
                gradient: "from-blue-500/20 to-indigo-600/20",
                border: "border-blue-500/30",
                bg: "bg-blue-500/10"
              },
              {
                icon: "⏰",
                title: "Zaman Kuralları",
                rules: [
                  "Geliştirme süresi tam 48 saattir",
                  "Tema açıklanmadan önce kod yazılamaz",
                  "Süre sonunda projeler teslim edilmelidir",
                  "Geç teslim kabul edilmez"
                ],
                gradient: "from-green-500/20 to-emerald-600/20",
                border: "border-green-500/30",
                bg: "bg-green-500/10"
              },
              {
                icon: "⚙️",
                title: "Teknik Kurallar",
                rules: [
                  "Herhangi bir oyun motoru kullanılabilir",
                  "Ücretsiz veya lisanslı yazılımlar kullanılabilir",
                  "Hazır asset'ler kullanılabilir (kaynak belirtilmeli)",
                  "Oyun çalışır durumda olmalıdır"
                ],
                gradient: "from-orange-500/20 to-red-600/20",
                border: "border-orange-500/30",
                bg: "bg-orange-500/10"
              },
              {
                icon: "📦",
                title: "Teslim Kuralları",
                rules: [
                  "Oyun dosyaları ve kaynak kodları teslim edilmelidir",
                  "README dosyası zorunludur",
                  "Oyun videosu veya screenshot'ları eklenmelidir",
                  "Dosya boyutu 500MB'ı geçmemelidir"
                ],
                gradient: "from-purple-500/20 to-pink-600/20",
                border: "border-purple-500/30",
                bg: "bg-purple-500/10"
              }
            ].map((card, index) => (
              <div
                key={index}
                className={`
                  group relative p-8 rounded-2xl 
                  bg-gradient-to-br ${card.gradient}
                  border ${card.border} backdrop-blur-sm
                  hover:scale-105 hover:shadow-2xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${card.bg} flex items-center justify-center mx-auto mb-6 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-center group-hover:text-white transition-colors duration-300">
                    {card.title}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {card.rules.map((rule, ruleIndex) => (
                      <li key={ruleIndex} className="text-slate-700 dark:text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                        • {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tema Kuralları - daha modern */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-yellow-500/10
            hover:shadow-3xl hover:shadow-yellow-500/20
            transition-all duration-500 hover:scale-[1.02]
            group
          "
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <PageHeader
              title="Tema Kuralları"
              desc="2025 yılı için belirlenen özel tema ve gereksinimler"
              variant="plain"
            />

            <div className="mt-10 space-y-8">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 group-hover:scale-[1.02] transition-transform duration-500">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-6">
                  2025 Teması: "Yarışma başlangıcında açıklanacak"
                </h3>
                <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                  Bu yılın teması, yarışma başlangıcında tüm katılımcılara açıklanacaktır. 
                  Tema açıklanana kadar oyun geliştirmeye başlanamaz.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Tema Gereksinimleri:
                  </h4>
                  <ul className="space-y-4">
                    {[
                      "Oyun, puan sistemi içermelidir",
                      "Kullanıcılar oynayarak ödüller kazanabilmelidir",
                      "Tema açıkça görülebilir olmalıdır",
                      "Orijinal ve yaratıcı olmalıdır"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-4 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-300">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Değerlendirme Kriterleri - daha etkileyici */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-emerald-500/10
            hover:shadow-3xl hover:shadow-emerald-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,182,212,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Değerlendirme Kriterleri"
            desc="Jüri üyelerinin oyunları değerlendirirken kullanacağı kriterler"
            variant="plain"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {[
              { percentage: "20%", title: "Yaratıcılık ve Görsel", desc: "Orijinal fikirler, sanat yönetimi ve görsel çekicilik", color: "emerald", gradient: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/30" },
              { percentage: "20%", title: "Teknik Kalite", desc: "Kod kalitesi, performans, hata yokluğu ve teknik mükemmellik", color: "blue", gradient: "from-blue-500/20 to-indigo-600/20", border: "border-blue-500/30" },
              { percentage: "20%", title: "Oynanabilirlik", desc: "Oyun mekanikleri, kullanıcı deneyimi ve eğlence faktörü", color: "purple", gradient: "from-purple-500/20 to-violet-600/20", border: "border-purple-500/30" },
              { percentage: "20%", title: "Tema Uyumu", desc: "Verilen temaya uygunluk ve konsept tutarlılığı", color: "orange", gradient: "from-orange-500/20 to-amber-600/20", border: "border-orange-500/30" },
              { percentage: "20%", title: "Sosyal Medya", desc: "#Şehitkamil etiketiyle yapılan paylaşımlar", color: "cyan", gradient: "from-cyan-500/20 to-sky-600/20", border: "border-cyan-500/30" }
            ].map((criterion, index) => (
              <div
                key={index}
                className={`
                  group p-8 rounded-2xl 
                  bg-gradient-to-br ${criterion.gradient}
                  border ${criterion.border} backdrop-blur-sm
                  hover:scale-110 hover:shadow-2xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
              >
                <div className={`text-4xl font-black text-${criterion.color}-600 mb-4 group-hover:scale-125 transition-transform duration-500`}>
                  {criterion.percentage}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors duration-300">
                  {criterion.title}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                  {criterion.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Diskalifiye Durumları - daha şık */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-red-500/10
            hover:shadow-3xl hover:shadow-red-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(245,101,101,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Diskalifiye Durumları"
            desc="Bu durumlar yarışmadan diskalifiye olmanıza neden olabilir"
            variant="plain"
          />

          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                icon: "🚫",
                title: "Yasaklı İçerik",
                items: [
                  "Müstehcen veya uygunsuz içerik",
                  "Şiddet içeren görseller",
                  "Telif hakkı ihlali",
                  "Kötü niyetli kod"
                ],
                gradient: "from-red-500/20 to-pink-600/20",
                border: "border-red-500/30"
              },
              {
                icon: "⚠️",
                title: "Kural İhlalleri",
                items: [
                  "Geç teslim",
                  "Çalışmayan oyun",
                  "Eksik dosyalar",
                  "Kopya içerik"
                ],
                gradient: "from-orange-500/20 to-yellow-600/20",
                border: "border-orange-500/30"
              },
              {
                icon: "🤝",
                title: "Davranış Kuralları",
                items: [
                  "Hakaret veya küfür",
                  "Diğer katılımcılara zarar verme",
                  "Organizasyon ekibine saygısızlık",
                  "Yarışmayı baltalama girişimi"
                ],
                gradient: "from-gray-500/20 to-slate-600/20",
                border: "border-gray-500/30"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`
                  group p-8 rounded-2xl 
                  bg-gradient-to-br ${item.gradient}
                  border ${item.border} backdrop-blur-sm
                  hover:scale-105 hover:shadow-xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6 text-4xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-center group-hover:text-white transition-colors duration-300">
                  {item.title}
                </h3>
                <ul className="space-y-3 text-sm">
                  {item.items.map((rule, ruleIndex) => (
                    <li key={ruleIndex} className="text-slate-700 dark:text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                      • {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Sık Sorulan Sorular - daha interaktif */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-indigo-500/10
            hover:shadow-3xl hover:shadow-indigo-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(147,51,234,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Sık Sorulan Sorular"
            desc="Katılımcıların en çok merak ettiği konular"
            variant="plain"
          />

          <div className="mt-10 space-y-6">
            {[
              {
                question: "Hangi oyun motorları kullanılabilir?",
                answer: "Unity, Unreal Engine, Godot, GameMaker Studio, Construct, Scratch veya herhangi bir oyun motoru kullanabilirsiniz. Ayrıca sıfırdan kod yazarak da oyun geliştirebilirsiniz.",
                gradient: "from-indigo-500/20 to-purple-600/20",
                border: "border-indigo-500/30"
              },
              {
                question: "Hazır asset'ler kullanabilir miyim?",
                answer: "Evet, ücretsiz veya lisanslı asset'ler kullanabilirsiniz. Ancak kullandığınız asset'lerin kaynaklarını README dosyasında belirtmeniz zorunludur.",
                gradient: "from-emerald-500/20 to-teal-600/20",
                border: "border-emerald-500/30"
              },
              {
                question: "Takım değişikliği yapabilir miyim?",
                answer: "Başvuru süresi sona ermeden önce takım değişikliği yapabilirsiniz. Başvuru süresi bittikten sonra değişiklik yapılamaz.",
                gradient: "from-orange-500/20 to-amber-600/20",
                border: "border-orange-500/30"
              },
              {
                question: "Oyun hangi platformlarda çalışmalı?",
                answer: "Oyununuz Windows, macOS veya web platformlarında çalışabilir. Jüri üyelerinin test edebilmesi için gerekli kurulum talimatları README dosyasında yer almalıdır.",
                gradient: "from-pink-500/20 to-rose-600/20",
                border: "border-pink-500/30"
              }
            ].map((faq, index) => (
              <div
                key={index}
                className={`
                  group p-8 rounded-2xl 
                  bg-gradient-to-r ${faq.gradient}
                  border ${faq.border} backdrop-blur-sm
                  hover:scale-[1.02] hover:shadow-xl
                  transition-all duration-500 ease-out
                  cursor-pointer
                `}
              >
                <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors duration-300">
                  {faq.question}
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-100 transition-colors duration-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* İletişim Desteği - daha modern */}
        <div
          className="
            relative rounded-3xl backdrop-blur-xl p-10 text-center
            border border-white/30 dark:border-white/20
            shadow-2xl shadow-cyan-500/10
            hover:shadow-3xl hover:shadow-cyan-500/20
            transition-all duration-500 hover:scale-[1.01]
          "
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.05) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <PageHeader
            title="Kural Hakkında Sorularınız mı Var?"
            desc="Kurallar hakkında herhangi bir sorunuz varsa bizimle iletişime geçebilirsiniz"
            variant="plain"
          />

          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <a 
              href="mailto:rules@gamejam.org" 
              className="
                group inline-flex items-center gap-3 px-8 py-4 
                bg-gradient-to-r from-blue-600 to-blue-700 
                hover:from-blue-500 hover:to-blue-600
                text-white rounded-2xl font-semibold
                transition-all duration-300 hover:scale-105 hover:shadow-2xl
                shadow-lg
              "
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              E-posta Gönder
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
