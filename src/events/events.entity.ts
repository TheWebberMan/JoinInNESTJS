export class Event {
    id: number;
    titel: string;
    beskrivelse: string;
    tag: string;
    billede: string;   // URL til billedet
    lat: number;
    long: number;
    host: string;
    dato: string;      // ISO-format, f.eks. "2026-12-05T18:00:00"
    adresse: string;
}
