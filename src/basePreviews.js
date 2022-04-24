const basePreviews = [
  {
    id: '626563e6ef17c6f56986697e',
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
