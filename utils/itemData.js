// utils/itemData.js
const itemData = {
    hammers: {
      yur: {
        image: require('../assets/item sprites/hammers/woodenHammer_sprite.png'),
        name: 'Hammer of Yur',
        description: 'Hits eggs. +2 clicks for every Egg click.',
        cost: 100,
        bonusClicks: 2,
      },
      tou: {
        image: require('../assets/item sprites/hammers/ironHammer_sprite.png'),
        name: 'Hammer of Tou',
        description: 'Hits eggs hard. +5 clicks for every Egg click.',
        cost: 500,
        bonusClicks: 5,
      },
      gude: {
        image: require('../assets/item sprites/hammers/goldHammer_sprite.png'),
        name: 'Hammer of Gude',
        description: 'Hits eggs harder. +10 clicks and +3 C for every Egg click.',
        cost: 1000,
        bonusClicks: 10,
        bonusGold: 3,
      }
    },
    scrolls: {
      dragon: [
          {
              id: 'dragon1',
              image: require('../assets/item sprites/scrolls/dragon scroll/dragonscroll_sprite.png'),
              name: "Brywyn’s Scroll I",
              description: 'Describes Dragons. Increases gold earned from Adult-dragons (+{4} gold on click).',
              cost: 2100,
              effects: {
                bonusAdultGold: 4
              }
          },
          {
              id: 'dragon2',
              image: require('../assets/item sprites/scrolls/dragon scroll/dragonscroll_sprite.png'),
              name: "Brywyn’s Scroll II",
              description: 'Describes Dragons more. Multiplies gold earned by the number of dragon species collected (x6 MAX).',
              cost: 4100,
              effects: {
                goldMultiplier: 1
              }
          }
      ],
      drake: [
          {
              id: 'drake1',
              image: require('../assets/item sprites/scrolls/drake scroll/drakescroll_sprite.png'),
              name: "Anpero’s Scroll I",
              description: 'Describes Drakes. Increases gold earned from Adult-drakes (+{4} gold on click).',
              cost: 1300,
              effects: {
                bonusAdultGold: 4
              }
          },
          {
              id: 'drake2',
              image: require('../assets/item sprites/scrolls/drake scroll/drakescroll_sprite.png'),
              name: "Anpero’s Scroll II",
              description: 'Describes Drakes more. Multiplies gold earned by the number of Drake species collected (x2 MAX).',
              cost: 2600,
              effects: {
                goldMultiplier: 1
              }
          }
      ],
      wyvern: [
          {
              id: 'wyvern1',
              image: require('../assets/item sprites/scrolls/wyvern scroll/wyvernscroll_sprite.png'),
              name: "Arostiv’s Scroll I",
              description: 'Describes Wyverns. Increases gold earned from Adult-wyverns (+{4} gold on click).',
              cost: 800,
              effects: {
                bonusAdultGold: 4
              }
          },
          {
              id: 'wyvern2',
              image: require('../assets/item sprites/scrolls/wyvern scroll/wyvernscroll_sprite.png'),
              name: "Arostiv’s Scroll II",
              description: 'Describes Wyverns more. Multiplies gold earned by the number of Wyvern species collected (x2 MAX).',
              cost: 1600,
              effects: {
                goldMultiplier: 1
              }
          }
      ],
      gold: [
          {
              id: 'gold1',
              image: require('../assets/item sprites/scrolls/coin scroll/coinscroll_sprite.png'),
              name: "Danask’s Scroll I",
              description: 'Describes gold. +1 gold for every click.',
              cost: 800,
              effects: {
                goldBonus: 1
              }
          },
          {
              id: 'gold2',
              image: require('../assets/item sprites/scrolls/coin scroll/coinscroll_sprite.png'),
              name: "Danask’s Scroll II",
              description: 'Describes gold more. +4 gold for every click.',
              cost: 1600,
              effects: {
                goldBonus: 4
              }
          },
          {
              id: 'gold3',
              image: require('../assets/item sprites/scrolls/coin scroll/coinscroll_sprite.png'),
              name: "Danask’s Scroll III",
              description: 'Describes gold even more. x2 gold from all sources.',
              cost: 3200,
              effects: {
                goldMultiplier: 2
              }
          }
      ],
      egg: [
          {
              id: 'egg1',
              image: require('../assets/item sprites/scrolls/egg scroll/eggscroll_sprite.png'),
              name: "Jothur’s Scroll I",
              description: 'Describes Eggs. Faster Hatching rate (⅔ clicks needed).',
              cost: 500,
              effects: {
                clickReducer: 1/3
              }
          },
          {
              id: 'egg2',
              image: require('../assets/item sprites/scrolls/egg scroll/eggscroll_sprite.png'),
              name: "Jothur’s Scroll II",
              description: 'Describes Eggs more. Faster Hatching rate (½ clicks needed).',
              cost: 1500,
              effects: {
                clickReducer: 1/2
              }
          }
      ]
    },
    totems: {
      dragon: {
        image: require('../assets/item sprites/totems/dragon_totem.png'),
        name: 'Totem of Sef Enna',
        cost: 5000,
        requirements: { type: 'Dragon', count: 6 },
        effects: {
          clickBonus: 100,
          goldBonus: 6,
          growTimeMultiplier: 1/3,
        }
      },
      drake: {
        image: require('../assets/item sprites/totems/drake_totem.png'),
        name: 'Totem of Rac Nivt',
        cost: 5000,
        requirements: { type: 'Drake', count: 2 },
        effects: {
          clickBonus: 100,
          goldBonus: 6,
          growTimeMultiplier: 1/3,
        }
      },
      wyvern: {
        image: require('../assets/item sprites/totems/wyvern_totem.png'),
        name: 'Totem of Ga Hib',
        cost: 5000,
        requirements: { type: 'Wyvern', count: 2 },
        effects: {
          clickBonus: 100,
          goldBonus: 6,
          growTimeMultiplier: 1/3,
        }
      }
    },
    potions: [
        {
          image: require('../assets/item sprites/potions/mana1_sprite.png'),
          name: 'Mana Potion I',
          description: 'Enhances hands. Automatically +1 clicks Eggs every 3s.',
          cost: 300,
        },
        {
          image: require('../assets/item sprites/potions/mana1_sprite.png'),
          name: 'Mana Potion II',
          description: 'Enhances hands more. Automatically clicks Adults every 3s.',
          cost: 900,
        }
    ]
  };
  
  export default itemData;
  