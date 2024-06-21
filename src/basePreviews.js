const basePreviews = [
  {
    id: '6675795f82c542d346801d2e',
    enabled: true,
    alias: '3.x',
    label: 'farmOS v3',
    description: 'Try a fresh installation of farmOS. Demo includes:',
    features: [
      "Quick forms",
      "Mapbox maps",
      "API access",
      "Community modules",
      "Multiple languages",
    ],
    icon: 'LANDUSEPLANNING-SavannahChappus.svg',
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
    icon: 'CROPROTATION.svg',
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
    icon: 'MANAGEDROTATIONALGRAZING.svg',
  },
]

export default basePreviews
