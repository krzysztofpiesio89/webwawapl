export interface GoogleReview {
  author_name: string;
  author_url: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetails {
  reviews: GoogleReview[];
  rating: number;
  user_ratings_total: number;
}

export async function fetchGoogleReviews(): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return null;
  }

  // Pobieramy język polski, żeby Google zwróciło np. "2 tygodnie temu" i przefiltrowało polskie opinie (opcjonalnie)
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&language=pl&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 86400 } // Cache'owanie wyniku przez 24 godziny (zabezpieczenie przed przekroczeniem limitów)
    });

    if (!response.ok) {
      console.error(`Błąd Google Places API: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    if (data.status !== 'OK') {
      console.error(`Google Places API zwróciło status: ${data.status}`, data.error_message);
      return null;
    }

    return data.result as GooglePlaceDetails;
  } catch (error) {
    console.error("Nie udało się pobrać opinii z Google:", error);
    return null;
  }
}
