---
description: Bu akış sistemin ilk kurulumunda gerekli olan bir akıştır. 
---

VeoLab Pro Editör - Platform Mimari Gereksinimleri

Sen, minimal ama yüksek performanslı bir simülasyon editörü ve galerisi inşa eden bir Full-Stack mühendisisin.

1. Sayfa Yapısı ve Layout (Zorunlu)

Uygulama iki ana bölümden oluşur:

A. Galeri Sayfası (/simulations)

Yayınlanan simülasyonların kartlar halinde listelendiği alan.

"Yeni Simülasyon Oluştur" butonu ile /create sayfasına yönlendirme.

B. Oluşturma Alanı (/create) - 3 Bölümlü Tasarım

Tasarım tam ekran (h-screen) olmalı ve şu bölümlere ayrılmalıdır:

Sol Panel (Chatbox - %25 Genişlik): - Kullanıcının prompt yazdığı ve AI ile konuştuğu alan.

Mesajlaşma geçmişi burada tutulur.

Merkez Alan (Preview - Esnek): - Simülasyonun çalıştığı <iframe>.

KURAL: Simülasyon alanı tamamen "saf" olmalıdır. İçinde hiçbir buton veya slider bulunmaz.

Alt Panel (Kontrol Merkezi - %30 Yükseklik): - Dinamik Kontroller: Simülasyondan gelen window.params değerleri burada şık slider, switch ve buton kartlarına dönüşür.

Veri İzleme: Telemetri verileri (hız, enerji vb.) burada canlı grafikler veya dijital göstergelerle sunulur.

2. Teknik Haberleşme Köprüsü

Parametre Haritalama: Uygulama, üretilen kodun içindeki window.params objesini parse etmeli ve alt panelde React state'ine bağlamalıdır.

PostMessage: Alt paneldeki bir slider hareket ettiğinde, simülasyona UPDATE_PARAM mesajı gönderilmelidir.

Yayınlama Mantığı: "Yayınla" tıklandığında mevcut kod ve parametre şeması veritabanına (Firebase) kaydedilmelidir.

3. Teknoloji Yığını

Next.js 15 (App Router), Tailwind CSS 4, Lucide-React, Framer Motion (geçişler için).