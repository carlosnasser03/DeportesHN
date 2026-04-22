/**
 * Seed - Datos de prueba iniciales
 * Crea Organizations (base de equipos con logo único)
 * Crea 6 categorías
 * Crea Teams (instancias de Organization en cada Category)
 * Crea partidos de ejemplo
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { name: 'U7', label: 'Sub-7', color: '#FF6B6B', ageRange: '5-7 años' },
  { name: 'U9', label: 'Sub-9', color: '#4ECDC4', ageRange: '7-9 años' },
  { name: 'U11', label: 'Sub-11', color: '#45B7D1', ageRange: '9-11 años' },
  { name: 'U13', label: 'Sub-13', color: '#96CEB4', ageRange: '11-13 años' },
  { name: 'U15', label: 'Sub-15', color: '#FFEAA7', ageRange: '13-15 años' },
  { name: 'U17', label: 'Sub-17', color: '#DFE6E9', ageRange: '15-17 años' },
];

const TOWNS = [
  'Tegucigalpa', 'Comayagüela', 'La Ceiba', 'San Pedro Sula',
  'Danlí', 'Cortés', 'Olancho', 'Yoro', 'Colón', 'Atlántida'
];

const ORGANIZATIONS = [
  { name: 'Los Guerreros', color: '#FF0000', logo: null },
  { name: 'Águilas FC', color: '#FFD700', logo: null },
  { name: 'Real Madrid', color: '#FFFFFF', logo: null },
  { name: 'Barcelona', color: '#004687', logo: null },
  { name: 'Los Tigres', color: '#FF6600', logo: null },
  { name: 'Deportivo Astra', color: '#0066CC', logo: null },
  { name: 'Olimpia', color: '#FF0000', logo: null },
  { name: 'Marathón', color: '#0000FF', logo: null },
  { name: 'Las Aces', color: '#00AA00', logo: null },
  { name: 'Verdolaga FC', color: '#00CC00', logo: null },
  { name: 'Los Defensores', color: '#990099', logo: null },
  { name: 'Puerta del Cielo', color: '#CCCCCC', logo: null },
  { name: 'Real Juventud', color: '#FF00FF', logo: null },
  { name: 'Santos FC', color: '#FFFF00', logo: null },
  { name: 'Premier FC', color: '#FF3333', logo: null },
  { name: 'Academia FC', color: '#3333FF', logo: null },
  { name: 'Los Valientes', color: '#33FF33', logo: null },
  { name: 'Inter CF', color: '#000000', logo: null },
  { name: 'United Stars', color: '#FF00AA', logo: null },
  { name: 'Dynamic FC', color: '#00FFFF', logo: null },
  { name: 'Phoenix FC', color: '#FF6600', logo: null },
  { name: 'Rapid City', color: '#0066FF', logo: null },
  { name: 'Storm United', color: '#666600', logo: null },
  { name: 'Victory FC', color: '#006666', logo: null },
  { name: 'Crown FC', color: '#660066', logo: null },
  { name: 'Elite FC', color: '#FF9900', logo: null },
  { name: 'Capital FC', color: '#009900', logo: null },
  { name: 'Dynasty FC', color: '#990000', logo: null },
  { name: 'Star Power', color: '#00FF99', logo: null },
  { name: 'Royal FC', color: '#99FF00', logo: null }
];

const STADIUMS = [
  'Estadio Nacional', 'Estadio Olímpico', 'Campo Los Próceres',
  'Estadio Morazán', 'Campo municipal', 'Cancha auxiliar',
  'Polideportivo Central', 'Complejo deportivo norte',
];

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // Limpiar datos existentes
    await prisma.match.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.organization.deleteMany({});
    await prisma.category.deleteMany({});
    console.log('🗑️  Datos anteriores eliminados');

    // Crear Organizations (equipos base con logo único)
    const organizations = await Promise.all(
      ORGANIZATIONS.map(org =>
        prisma.organization.create({
          data: {
            name: org.name,
            color: org.color,
            logo: org.logo,
            town: TOWNS[Math.floor(Math.random() * TOWNS.length)],
          },
        })
      )
    );
    console.log(`✅ ${organizations.length} organizations creadas`);

    // Crear categorías
    const categories = await Promise.all(
      CATEGORIES.map(cat =>
        prisma.category.create({
          data: {
            name: cat.name,
            label: cat.label,
            color: cat.color,
            ageRange: cat.ageRange,
            maxTeams: 30,
          },
        })
      )
    );
    console.log(`✅ ${categories.length} categorías creadas`);

    // Crear Teams: una instancia de cada Organization en cada Category
    const teams: any[] = [];
    for (const category of categories) {
      const categoryTeams = await Promise.all(
        organizations.map((org, index) =>
          prisma.team.create({
            data: {
              organizationId: org.id,
              categoryId: category.id,
              coach: `Coach ${org.name} ${category.name}`,
            },
          })
        )
      );
      teams.push(...categoryTeams);
    }
    console.log(`✅ ${teams.length} teams creados (${organizations.length} por categoría)`);

    // Crear jugadores por team (5 jugadores de ejemplo por team)
    const PLAYER_NAMES = [
      'Juan López', 'Carlos García', 'Marco Pérez', 'Luis Hernández', 'Diego Castillo',
      'Miguel Torres', 'Roberto Sánchez', 'Fernando Ruiz', 'Andrés Morales', 'Pablo Vázquez'
    ];

    const POSICIONES = ['Portero', 'Defensa', 'Mediocampista', 'Delantero'];

    let playerCount = 0;
    for (const team of teams) {
      const playersForTeam = await Promise.all(
        PLAYER_NAMES.slice(0, 5).map((name, index) =>
          prisma.player.create({
            data: {
              teamId: team.id,
              name: `${name} ${team.id.slice(0, 5)}`, // Nombre único por team
              dorsal: index + 1,
              posicion: POSICIONES[index % POSICIONES.length],
              edad: Math.floor(Math.random() * 4) + 7, // 7-10 años
              photoUrl: null, // Null por ahora, se agregará con Cloudinary después
            },
          })
        )
      );
      playerCount += playersForTeam.length;
    }
    console.log(`✅ ${playerCount} jugadores creados (5 por team)`);

    // Crear partidos de ejemplo (10 por categoría) + stats de jugadores
    let matchCount = 0;
    for (const category of categories) {
      const categoryTeams = teams.filter(t => t.categoryId === category.id);

      // Crear 10 partidos por categoría
      for (let i = 0; i < 10; i++) {
        const homeTeam = categoryTeams[i % categoryTeams.length];
        const awayTeam = categoryTeams[(i + 1) % categoryTeams.length];

        if (homeTeam.id !== awayTeam.id) {
          const date = new Date();
          date.setDate(date.getDate() + Math.floor(Math.random() * 30));
          date.setHours(Math.floor(Math.random() * 20) + 6);

          const status = ['scheduled', 'live', 'finished'][Math.floor(Math.random() * 3)];

          const match = await prisma.match.create({
            data: {
              categoryId: category.id,
              homeTeamId: homeTeam.id,
              awayTeamId: awayTeam.id,
              date,
              location: STADIUMS[Math.floor(Math.random() * STADIUMS.length)],
              status,
              homeScore: status === 'finished' ? Math.floor(Math.random() * 5) : null,
              awayScore: status === 'finished' ? Math.floor(Math.random() * 5) : null,
            },
          });

          // Si el partido está terminado, crear stats de goles
          if (status === 'finished') {
            const homeTeamPlayers = await prisma.player.findMany({
              where: { teamId: homeTeam.id },
              take: 3,
            });

            const awayTeamPlayers = await prisma.player.findMany({
              where: { teamId: awayTeam.id },
              take: 3,
            });

            // Crear stats para algunos jugadores
            for (const player of homeTeamPlayers) {
              if (Math.random() > 0.5) {
                await prisma.playerStat.create({
                  data: {
                    playerId: player.id,
                    matchId: match.id,
                    goalsScored: Math.floor(Math.random() * 3),
                    assists: Math.floor(Math.random() * 2),
                    yellowCards: Math.random() > 0.8 ? 1 : 0,
                    redCards: 0,
                  },
                });
              }
            }

            for (const player of awayTeamPlayers) {
              if (Math.random() > 0.5) {
                await prisma.playerStat.create({
                  data: {
                    playerId: player.id,
                    matchId: match.id,
                    goalsScored: Math.floor(Math.random() * 3),
                    assists: Math.floor(Math.random() * 2),
                    yellowCards: Math.random() > 0.8 ? 1 : 0,
                    redCards: 0,
                  },
                });
              }
            }
          }

          matchCount++;
        }
      }
    }
    console.log(`✅ ${matchCount} partidos creados`);

    console.log('\n✨ Seed completado exitosamente!');
    console.log(`
    📊 Resumen:
    - Organizations: ${organizations.length}
    - Categorías: ${categories.length}
    - Teams: ${teams.length}
    - Partidos: ${matchCount}

    🏆 Estructura:
    Cada Organization tiene un Team en cada Category
    → Real Madrid (org) → Real Madrid U9 (team) + Real Madrid U11 (team) + ...
    → Todos comparten el MISMO LOGO

    🚀 Próximo paso: npm run dev
    `);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
