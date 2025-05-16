const creatureData = {
  Red: {
    type: 'Dragon',
    egg: {
      images: [
        require('../assets/Dragons/Red/egg_sprites/sprite_0.png'),
        require('../assets/Dragons/Red/egg_sprites/sprite_1.png'),
        require('../assets/Dragons/Red/egg_sprites/sprite_2.png'),
      ],
      color: 'Red',
      rarity: 1.0,
      clicksNeeded: 60,
      // progress: 0,
      boosts: 0,
      weight: 0
    },
    babyImage: null,
    adultImage: require('../assets/Dragons/Red/adult.gif'),
  },
  Blue: {
    type: 'Dragon',
    egg: {
      images: [
        require('../assets/Dragons/Blue/egg_sprites/sprite_0.png'),
        require('../assets/Dragons/Blue/egg_sprites/sprite_1.png'),
        require('../assets/Dragons/Blue/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 60,
      // progress: 0,
      // boosts: 0,
      weight: 2
    },
    growthTimeMs: 300000, //5mins
    babyImage: require('../assets/Dragons/Blue/baby.gif'),
    adultImage: require('../assets/Dragons/Blue/adult.gif')
  },
  Green: {
    type: 'Dragon',
    egg: {
      images: [
        require('../assets/Dragons/Green/egg_sprites/sprite_0.png'),
        require('../assets/Dragons/Green/egg_sprites/sprite_1.png'),
        require('../assets/Dragons/Green/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 60,
      // progress: 0,
      // boosts: 0,
      weight: 2
    },
    growthTimeMs: 300000, //5mins
    babyImage: require('../assets/Dragons/Green/baby.gif'),
    adultImage: require('../assets/Dragons/Green/adult.gif')
  },
  Gold: {
    type: 'Dragon',
    egg: {
      images: [
        require('../assets/Dragons/Gold/egg_sprites/sprite_0.png'),
        require('../assets/Dragons/Gold/egg_sprites/sprite_1.png'),
        require('../assets/Dragons/Gold/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 60,
      // progress: 0,
      // boosts: 0,
      weight: 1
    },
    babyImage: null,
    adultImage: require('../assets/Dragons/Gold/adult.gif')
  },
  Orange: {
    type: 'Dragon',
    egg: {
      images: [
        require('../assets/Dragons/Orange/egg_sprites/sprite_0.png'),
        require('../assets/Dragons/Orange/egg_sprites/sprite_1.png'),
        require('../assets/Dragons/Orange/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 60,
      // progress: 0,
      // boosts: 0,
      weight: 2
    },
    growthTimeMs: 300000, //5mins
    babyImage: require('../assets/Dragons/Orange/baby.gif'),
    adultImage: require('../assets/Dragons/Orange/adult.gif')
  },
  White: {
    type: 'Dragon',
    egg: {
      images: [
        require('../assets/Dragons/White/egg_sprites/sprite_0.png'),
        require('../assets/Dragons/White/egg_sprites/sprite_1.png'),
        require('../assets/Dragons/White/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 60,
      // progress: 0,
      // boosts: 0,
      weight: 1
    },
    growthTimeMs: 300000, //5mins
    babyImage: require('../assets/Dragons/White/baby.gif'),
    adultImage: require('../assets/Dragons/White/adult.gif')
  },
  'Black-Violet': {
    type: 'Drake',
    egg: {
      images: [
        require('../assets/Drakes/Black-Violet/egg_sprites/sprite_0.png'),
        require('../assets/Drakes/Black-Violet/egg_sprites/sprite_1.png'),
        require('../assets/Drakes/Black-Violet/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 30,
      weight: 1
    },
    growthTimeMs: 240000, //4mins
    babyImage: require('../assets/Drakes/Black-Violet/baby.gif'),
    adultImage: require('../assets/Drakes/Black-Violet/adult.gif')
  },
  'Green-Red': {
    type: 'Drake',
    egg: {
      images: [
        require('../assets/Drakes/Green-Red/egg_sprites/sprite_0.png'),
        require('../assets/Drakes/Green-Red/egg_sprites/sprite_1.png'),
        require('../assets/Drakes/Green-Red/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 30,
      weight: 3
    },
    growthTimeMs: 240000, //4mins
    babyImage: require('../assets/Drakes/Green-Red/baby.gif'),
    adultImage: require('../assets/Drakes/Green-Red/adult.gif')
  },
  'Blue-Green': {
    type: 'Wyvern',
    egg: {
      images: [
        require('../assets/Wyverns/Blue-Green/egg_sprites/sprite_0.png'),
        require('../assets/Wyverns/Blue-Green/egg_sprites/sprite_1.png'),
        require('../assets/Wyverns/Blue-Green/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 10,
      weight: 3
    },
    growthTimeMs: 120000, //2mins
    babyImage: require('../assets/Wyverns/Blue-Green/baby.gif'),
    adultImage: require('../assets/Wyverns/Blue-Green/adult.gif')
  },
  'Brown-Green': {
    type: 'Wyvern',
    egg: {
      images: [
        require('../assets/Wyverns/Brown-Green/egg_sprites/sprite_0.png'),
        require('../assets/Wyverns/Brown-Green/egg_sprites/sprite_1.png'),
        require('../assets/Wyverns/Brown-Green/egg_sprites/sprite_2.png'),
      ],
      rarity: 1.0,
      clicksNeeded: 10,
      weight: 5
    },
    growthTimeMs: 120000, //2mins
    babyImage: require('../assets/Wyverns/Brown-Green/baby.gif'),
    adultImage: require('../assets/Wyverns/Brown-Green/adult.gif')
  },
};
 
export default creatureData;