import { NextRequest, NextResponse } from 'next/server';

const APIGAMES_BASE = 'https://v1.apigames.id';
const APIGAMES_MERCHANT = process.env.APIGAMES_MERCHANT_ID || '';
const APIGAMES_KEY = process.env.APIGAMES_API_KEY || '';
const APIGAMES_SECRET = process.env.APIGAMES_SECRET_KEY || '';

// Game ID mapping: BYgame internal ID → apigames game code for user check
const GAME_CHECK_MAP: Record<string, string> = {
  'mlbb': 'mobilelegend',
  'freefire': 'freefire',
  'pubgm': 'pubgm',
  'genshin-mobile': 'genshinimpact',
  'genshin-pc': 'genshinimpact',
  'honkai-star-rail': 'honkaistarrail',
  'codm': 'codmobile',
  'blood-strike': 'bloodstrike',
  'coc': 'clashofclans',
  'clash-royale': 'clashroyale',
  'valorant': 'valorant',
  'valorant-mobile': 'valorant',
  'lol': 'leagueoflegends',
  'roblox-mobile': 'roblox',
  'roblox-console': 'roblox',
  'steam-wallet': 'steamwallet',
  'fortnite-pc': 'fortnite',
  'fortnite-console': 'fortnite',
  'apex': 'apexlegends',
  'hayday': 'hayday',
  'stumble-guys': 'stumbleguys',
  'aov': 'arenaofvalor',
  'rise-of-kingdoms': 'riseofkingdoms',
  'ragnarok-m': 'ragnarokm',
  'dragon-city': 'dragoncity',
  'eight-ball-pool': '8ballpool',
  'among-us': 'amongus',
  'dota2': 'dota2',
  'cs2': 'csgo',
  'bdo': 'blackdesert',
  'lost-ark': 'lostark',
  'wow': 'wow',
  'fifa-online': 'fifaonline4',
  'point-blank': 'pointblank',
  'crossfire': 'crossfire',
};

// Game-specific label for UI hints
export const GAME_LABELS: Record<string, { idLabel: string; serverLabel: string; needServer: boolean; hint: string }> = {
  'mlbb': { idLabel: 'User ID', serverLabel: 'Zone ID', needServer: true, hint: 'Ketik User ID lalu klik Cek Nama' },
  'freefire': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID' },
  'pubgm': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID PUBG Mobile' },
  'genshin-mobile': { idLabel: 'UID', serverLabel: '', needServer: false, hint: 'Masukkan UID (format: 8-10 digit)' },
  'genshin-pc': { idLabel: 'UID', serverLabel: '', needServer: false, hint: 'Masukkan UID Genshin Impact' },
  'honkai-star-rail': { idLabel: 'UID', serverLabel: '', needServer: false, hint: 'Masukkan UID Honkai Star Rail' },
  'codm': { idLabel: 'Activision ID', serverLabel: '', needServer: false, hint: 'Masukkan Activision ID' },
  'blood-strike': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Blood Strike' },
  'coc': { idLabel: 'Player Tag', serverLabel: '', needServer: false, hint: 'Masukkan Player Tag (contoh: #P0YQ8LGJ)' },
  'clash-royale': { idLabel: 'Player Tag', serverLabel: '', needServer: false, hint: 'Masukkan Player Tag (contoh: #P0YQ8LGJ)' },
  'valorant': { idLabel: 'Riot ID', serverLabel: '', needServer: false, hint: 'Masukkan Riot ID (contoh: PlayerName#TAG)' },
  'valorant-mobile': { idLabel: 'Riot ID', serverLabel: '', needServer: false, hint: 'Masukkan Riot ID Valorant' },
  'lol': { idLabel: 'Summoner Name', serverLabel: 'Server', needServer: true, hint: 'Masukkan Summoner Name dan Server' },
  'roblox-mobile': { idLabel: 'Username', serverLabel: '', needServer: false, hint: 'Masukkan Username Roblox' },
  'roblox-console': { idLabel: 'Username', serverLabel: '', needServer: false, hint: 'Masukkan Username Roblox' },
  'steam-wallet': { idLabel: 'Steam ID', serverLabel: '', needServer: false, hint: 'Masukkan Steam ID' },
  'fortnite-pc': { idLabel: 'Epic Games ID', serverLabel: '', needServer: false, hint: 'Masukkan Epic Games Display Name' },
  'fortnite-console': { idLabel: 'Epic Games ID', serverLabel: '', needServer: false, hint: 'Masukkan Epic Games Display Name' },
  'apex': { idLabel: 'EA ID', serverLabel: '', needServer: false, hint: 'Masukkan EA Account ID' },
  'hayday': { idLabel: 'Player Tag', serverLabel: '', needServer: false, hint: 'Masukkan Player Tag Hay Day' },
  'stumble-guys': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Stumble Guys' },
  'aov': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID AOV' },
  'rise-of-kingdoms': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Rise of Kingdoms' },
  'ragnarok-m': { idLabel: 'Character ID', serverLabel: '', needServer: false, hint: 'Masukkan Character ID Ragnarok M' },
  'dragon-city': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Dragon City' },
  'eight-ball-pool': { idLabel: 'Miniclip ID', serverLabel: '', needServer: false, hint: 'Masukkan Miniclip ID' },
  'among-us': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Among Us' },
  'dota2': { idLabel: 'Steam ID / Dota ID', serverLabel: '', needServer: false, hint: 'Masukkan Steam ID atau Dota 2 Profile ID' },
  'cs2': { idLabel: 'Steam ID', serverLabel: '', needServer: false, hint: 'Masukkan Steam ID' },
  'bdo': { idLabel: 'Family Name', serverLabel: '', needServer: false, hint: 'Masukkan Family Name Black Desert' },
  'lost-ark': { idLabel: 'Character Name', serverLabel: '', needServer: false, hint: 'Masukkan Character Name Lost Ark' },
  'wow': { idLabel: 'Character Name', serverLabel: '', needServer: false, hint: 'Masukkan Character Name World of Warcraft' },
  'fifa-online': { idLabel: 'EA ID', serverLabel: '', needServer: false, hint: 'Masukkan EA ID FIFA Online 4' },
  'point-blank': { idLabel: 'UserID PB', serverLabel: '', needServer: false, hint: 'Masukkan UserID Point Blank' },
  'crossfire': { idLabel: 'UserID CF', serverLabel: '', needServer: false, hint: 'Masukkan UserID CrossFire' },
  'subway-surfers': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Subway Surfers' },
  'candy-crush': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID Candy Crush' },
  'minecraft-pc': { idLabel: 'Java Username', serverLabel: '', needServer: false, hint: 'Masukkan Java Username Minecraft' },
  'minecraft-console': { idLabel: 'Gamertag', serverLabel: '', needServer: false, hint: 'Masukkan Gamertag Minecraft' },
  'ps-store': { idLabel: 'Email PSN', serverLabel: '', needServer: false, hint: 'Masukkan Email akun PlayStation Network' },
  'xbox-gift': { idLabel: 'Microsoft Email', serverLabel: '', needServer: false, hint: 'Masukkan Email akun Microsoft/Xbox' },
  'nintendo-eshop': { idLabel: 'Nintendo ID', serverLabel: '', needServer: false, hint: 'Masukkan Nintendo Account Email' },
  'fifa-console': { idLabel: 'EA ID', serverLabel: '', needServer: false, hint: 'Masukkan EA ID' },
  'nba2k': { idLabel: 'Player ID', serverLabel: '', needServer: false, hint: 'Masukkan Player ID NBA 2K' },
  'gta-online': { idLabel: 'Social Club ID', serverLabel: '', needServer: false, hint: 'Masukkan Rockstar Social Club ID' },
  'cod-console': { idLabel: 'Activision ID', serverLabel: '', needServer: false, hint: 'Masukkan Activision ID' },
};

// GET /api/games/check-id?gameId=mlbb&userGameId=123456789&serverId=1234
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    const userGameId = searchParams.get('userGameId');
    const serverId = searchParams.get('serverId');

    if (!gameId || !userGameId) {
      return NextResponse.json(
        { success: false, message: 'gameId dan userGameId wajib diisi' },
        { status: 400 }
      );
    }

    // Return game-specific labels
    const gameLabel = GAME_LABELS[gameId] || null;

    // If apigames not configured, return error — no mock
    if (!APIGAMES_MERCHANT || !APIGAMES_KEY || !APIGAMES_SECRET) {
      console.log('[BYgame] apigames.id not configured');
      return NextResponse.json({
        success: false,
        message: 'Layanan pengecekan ID belum tersedia. Hubungi admin.',
        labels: gameLabel,
      });
    }

    // Real API: Check user via apigames.id
    const apiGameCode = GAME_CHECK_MAP[gameId];
    if (!apiGameCode) {
      return NextResponse.json({
        success: false,
        message: `Game ${gameId} belum didukung untuk pengecekan ID`,
        supportedGames: Object.keys(GAME_CHECK_MAP),
        labels: gameLabel,
      });
    }

    const crypto = require('crypto');

    const checkUrl = `${APIGAMES_BASE}/merchant/checkAccount`;
    const sign = crypto.createHash('md5')
      .update(`${APIGAMES_MERCHANT}${APIGAMES_SECRET}`)
      .digest('hex');

    const params = new URLSearchParams({
      merchantId: APIGAMES_MERCHANT,
      gameCode: apiGameCode,
      userGameId: userGameId,
      sign: sign,
    });

    if (serverId) {
      params.set('serverId', serverId);
    }

    console.log(`[BYgame] Checking user for game ${apiGameCode}, ID: ${userGameId}, server: ${serverId || '-'}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${checkUrl}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${APIGAMES_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (result.code !== 0 && result.code !== '0') {
      console.error('[BYgame] apigames.id check error:', result);
      return NextResponse.json({
        success: false,
        message: result.msg || 'Gagal mengecek ID game. Pastikan ID benar.',
        labels: gameLabel,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        userName: result.data?.userName || result.data?.name || result.data?.nickname || 'Tidak diketahui',
        userGameId,
        serverId: serverId || null,
        gameCode: apiGameCode,
        serverName: result.data?.serverName || result.data?.server || (serverId || null),
        raw: result.data,
      },
      labels: gameLabel,
    });
  } catch (error: unknown) {
    console.error('[BYgame] Error checking game user ID:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message: `Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
