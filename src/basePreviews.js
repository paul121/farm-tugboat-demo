const basePreviews = [
  {
    id: '618f7136908ae14527591948',
    enabled: true,
    alias: '2.x',
    label: 'farmOS 2.0',
    description: 'Try a fresh installation of farmOS. Demo includes:',
    features: [
      "Latest farmOS version",
      "All core modules",
      "Mapbox maps",
      "Multiple languages",
    ],
  },
  {
    id: null,
    enabled: false,
    alias: 'crop-plan',
    label: 'Crops',
    description: 'See how farmOS is used for crop production. Dataset includes:',
    features: [
      "Field maps",
      "Crop plans",
      "Seeding logs",
      "Transplanting logs",
      "Harvest logs",
    ],
  },
  {
    id: null,
    enabled: false,
    alias: 'grazing-plan',
    label: 'Animals',
    description: 'See how farmOS is used for animal management. Dataset includes:',
    features: [
      "Pasture maps",
      "Grazing plans",
      "Birth logs",
      "Movement logs",
      "Harvest logs",
    ],
  },
]

export default basePreviews