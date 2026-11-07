// TEMPORARY: sample listings for building the Browse UI before the real
// Firestore listingService exists. When it does, swap the import in
// hooks/useListings.js and delete this file. The returned shape is the
// shape the real service should return.
import { CAR_STATUS } from "../constants/carStatus";
import { CAR_CATEGORY, SPEC_TYPE, TRANSMISSION } from "../constants/carFilters";

const IMAGE_BASE = "https://lh3.googleusercontent.com/aida-public/";

const SAMPLE_LISTINGS = [
  {
    id: "car-001",
    title: "2023 Toyota Fortuner 2.8L",
    tagline: "SUV • 4x4",
    category: CAR_CATEGORY.SUV,
    transmission: TRANSMISSION.AUTOMATIC,
    pricePerDay: 3800,
    status: CAR_STATUS.AVAILABLE,
    rating: 4.9,
    ratingCount: 34,
    specs: [
      { type: SPEC_TYPE.TRANSMISSION, label: "Automatic" },
      { type: SPEC_TYPE.SEATS, label: "7 Seats" },
    ],
    location: "Cebu Business Park",
    ownerId: "owner-marco",
    ownerName: "Marco P.",
    imageUrl: `${IMAGE_BASE}AB6AXuCnfLRW9BN2InJjW8FwR9gYqGcPlG2Kg5ZZ2SSRr4rekXkWXT4r3mr9b3vix2lxH9r6giDdhq_yiiPusKaCeeA9ucmch5pgBZDUnxbEcKEV8oSemJTtv7U0mjoU65yXdncnM812i7ay6kLv_3214NqJ0bsOY_-cbNMe9fim60LQAq_Mpgto3WTGzowD6g4jufIXdCDBdE_hiGUXBTxTih9XngN1eyWH5BwU-gOZXJJ9A2OVuB7uz-3y`,
  },
  {
    id: "car-002",
    title: "2022 Honda City RS Sedan",
    tagline: "Sedan • RS Package",
    category: CAR_CATEGORY.SEDAN,
    transmission: TRANSMISSION.AUTOMATIC,
    pricePerDay: 1800,
    status: CAR_STATUS.AVAILABLE,
    rating: 4.7,
    ratingCount: 18,
    specs: [
      { type: SPEC_TYPE.FUEL, label: "1.5L Petrol" },
      { type: SPEC_TYPE.SEATS, label: "5 Seats" },
    ],
    location: "IT Park, Cebu City",
    ownerId: "owner-patricia",
    ownerName: "Patricia V.",
    imageUrl: `${IMAGE_BASE}AB6AXuC0X-WeL1g8jCmqWffnqA09IMRpl83Eq4obBUDF5S9qAw5uxUdklhT1b2Z_qgJkeMi1DZXpSgFB7rJhjPIk-MAsFm9lzt0nfzPQSwSvVbV9KCqhb6cJHHIf3IV5l4OExqZPHaPajfAMdOL3Lmw6vt-9t9PUZkP3Pv1OzYGPt0UQfte4iHl15ugNWQEyQBlpkZ_A88cq9pFSZ2NKumx_6Bp6OGqUfqvsCeNXwumHxmsuMxhx9Db_FlLt`,
  },
  {
    id: "car-003",
    title: "2021 Mitsubishi Montero Sport",
    tagline: "Mid-Size SUV • Diesel",
    category: CAR_CATEGORY.SUV,
    transmission: TRANSMISSION.MANUAL,
    pricePerDay: 3200,
    status: CAR_STATUS.RENTED,
    rating: 4.8,
    ratingCount: 22,
    specs: [
      { type: SPEC_TYPE.DIESEL, label: "Diesel Engine" },
      { type: SPEC_TYPE.SEATS, label: "7 Seats" },
    ],
    location: "Mandaue City",
    ownerId: "owner-carlo",
    ownerName: "Carlo D.",
    imageUrl: `${IMAGE_BASE}AB6AXuCCfTh9SpVRX_vI7X_4J7uATswrq5Hw_RRHvYyTp2tS4OzV66S4655oIjEp7nYXLLUCm_uKEl49kmt5Ie7soKG-6RW6Y0qorRueOVNVG-8EumYz0uuonQCmvHtU2E1fncxJnInpIotP-105q22i5kDzqt-gtDIw6zgOFh3X2T2g0pdpLQHZEzFzhZcPCqtsEnAIZeyA_CcZDkEfosffdgkbCxD-FPOiaGIc-fYjRWgKCkGlg6Jhh2Xq`,
  },
  {
    id: "car-004",
    title: "2024 Hyundai Staria Premium",
    tagline: "Luxury Van • Captain Seats",
    category: CAR_CATEGORY.VAN,
    transmission: TRANSMISSION.AUTOMATIC,
    pricePerDay: 4500,
    status: CAR_STATUS.AVAILABLE,
    rating: 4.95,
    ratingCount: 41,
    specs: [
      { type: SPEC_TYPE.CAPTAIN_SEATS, label: "Captain Seats" },
      { type: SPEC_TYPE.GROUP_SEATS, label: "10 Seats" },
    ],
    location: "Lapu-Lapu City / Mactan",
    ownerId: "owner-elena",
    ownerName: "Elena S.",
    imageUrl: `${IMAGE_BASE}AB6AXuDmaF1GInrwNp_6G6_U-H1Tum2jkM5ZpmtC6S5DBHdKDttyDSm6SB5MWRTNPfOLBWdUyBlFOU8pjWvF8ptlzEFG6QJwzqLJjL7cjXnRksxnxKlD7jKWOphQ19gWuVXmSt8AOslOtLioOS1i3yGJikHBIQmphgknBQgBt-rs3G37030UGw-6Zx2Lhj2baitne64dqR8dhtIPPuxbig7l46amJNusdfVaQC1OjyNFQvAsZGUS4Hqkuzwt`,
  },
  {
    id: "car-005",
    title: "2020 Suzuki Jimny AllGrip",
    tagline: "Compact 4WD • Off-Road Ready",
    category: CAR_CATEGORY.SUV,
    transmission: TRANSMISSION.MANUAL,
    pricePerDay: 2400,
    status: CAR_STATUS.AVAILABLE,
    rating: 4.9,
    ratingCount: 15,
    specs: [
      { type: SPEC_TYPE.TERRAIN, label: "4WD AllGrip" },
      { type: SPEC_TYPE.SEATS, label: "4 Seats" },
    ],
    location: "Lahug, Cebu City",
    ownerId: "owner-roberto",
    ownerName: "Roberto K.",
    imageUrl: `${IMAGE_BASE}AB6AXuB7RfH75jbL_effOCF59BdwcyEUvYt9qf9A9vSaXxwKAedaYIvuPQOcK9T0ebg4maT9k8ilEmkRRkvDygXwMaK2zX69RRACzUrnYU1QtViUPN1bGvEOAE-4mBSWVQFmuES6CrrgY1jfipbb5UHxQ_0eCZRuibAcz0ljSF4LYq7FU6XYQ-cuqrfwIPS7HFogWqxyD2Xb4FGXde3Xp_os31y1Zeod_uhsHFUnaXCep7Irckakj6_k01la`,
  },
  {
    id: "car-006",
    title: "2023 Nissan Navara Pro-4X",
    tagline: "Pickup Truck • Auto 4x4",
    category: CAR_CATEGORY.PICKUP,
    transmission: TRANSMISSION.AUTOMATIC,
    pricePerDay: 3000,
    status: CAR_STATUS.AVAILABLE,
    rating: 4.85,
    ratingCount: 27,
    specs: [
      { type: SPEC_TYPE.TRANSMISSION, label: "Automatic" },
      { type: SPEC_TYPE.CARGO, label: "Full Cargo Bed" },
    ],
    location: "South Road Properties",
    ownerId: "owner-david",
    ownerName: "David M.",
    imageUrl: `${IMAGE_BASE}AB6AXuA2LwFBivZn0WFeMwrf55sk-ypscJL8B8Ko0VjqNwqPfgufYKPiD-DcLoY0-YSWe7dyt5HK1BEvAuGWPYqTXjpMZ_BUJ6g5v62XLOTfOV58HrHOAxxSXXn2e_P38-fvwdu4IdiSfueWfyJLRr5rz4VXq9zXvOSFHyYGdAEKy8_8MvbpBGLwge-sfYysEeE1UZse2Q_nEp4p5XsN7dmTf_q4Umd3KH1-45jVDOQxwDACr1AbvANc8Awo`,
  },
  {
    id: "car-007",
    title: "2019 Toyota Vios 1.3E",
    tagline: "City Sedan • Super Saver",
    category: CAR_CATEGORY.SEDAN,
    transmission: TRANSMISSION.MANUAL,
    pricePerDay: 1400,
    status: CAR_STATUS.AVAILABLE,
    rating: 4.6,
    ratingCount: 12,
    specs: [
      { type: SPEC_TYPE.ECO, label: "Fuel Efficient" },
      { type: SPEC_TYPE.SEATS, label: "5 Seats" },
    ],
    location: "Colon, Cebu City",
    ownerId: "owner-angela",
    ownerName: "Angela T.",
    imageUrl: `${IMAGE_BASE}AB6AXuBo1TxwxEl2NpuFR8KGk7rpsr5HuJ6xqc4sznYlZ8YG4DYXOQrIJaJOzj11AvguoSgC_0b4GTU1A41q_kFBbX8nijEfdaEo9KNJ558_m-_nJaU1tQGLgNnDTRw7ZHnpcAL9Mh9O9oxYfyXH72ZE_PRHYhKuR1ate06Ko9_QlObs2Kv_5fSNK8VKTjemViyoCOT89xBQ07L3dh-s3XoDb5B6cAp4RARhdky8djd7WeRz5cNxpZlSRexq`,
  },
  {
    id: "car-008",
    title: "2022 Ford Everest Titanium",
    tagline: "Executive SUV • Sunroof",
    category: CAR_CATEGORY.SUV,
    transmission: TRANSMISSION.AUTOMATIC,
    pricePerDay: 3900,
    status: CAR_STATUS.RENTED,
    rating: 4.92,
    ratingCount: 38,
    specs: [
      { type: SPEC_TYPE.ROOF, label: "Panoramic Roof" },
      { type: SPEC_TYPE.SEATS, label: "7 Seats" },
    ],
    location: "Talisay City",
    ownerId: "owner-chris",
    ownerName: "Chris L.",
    imageUrl: `${IMAGE_BASE}AB6AXuAWdKkb77PBceYnWNUHGf0A8OG5FTtc0PWR3cToxpHozfbzZW7D_k0tfwiLP-S_LW4wG74OGblbE4aK7o73CcRYSbb7YypeBBy6dsGcXrbgF9EaTJdcevjBFv2E2kFP8lgKhZrUsDxX4dH2aqsjEHMY0bcxYusVQM5NarCQX-VsfYqYadBB5NYFpLcaqkso7tmw6kCByjT_EVbbAFf0nvVSofaE-JN6njNEGIu6kWUBkEIyS_jx07ND`,
  },
];

const FAKE_DELAY_MS = 300;

// Returns a copy of every listing as plain objects, like the real service will.
export async function getListings() {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY_MS));
  return SAMPLE_LISTINGS.map((car) => ({
    ...car,
    specs: car.specs.map((spec) => ({ ...spec })),
  }));
}
