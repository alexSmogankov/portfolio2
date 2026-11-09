export const categories = {
  all: { ru: 'Все работы', en: 'All projects' },
  simulation: { ru: 'Симуляторы', en: 'Simulation' },
  action: { ru: 'Экшен', en: 'Action' },
  adventure: { ru: 'Приключения', en: 'Adventure' },
  puzzle: { ru: 'Головоломки', en: 'Puzzle' },
  strategy: { ru: 'Стратегия', en: 'Strategy' }
};

const catalog = [
  {
    id: 'railroad-020', folder: 'RRE_play020', title: 'Railroad Empire', category: 'simulation', format: '2D / 3D',
    ru: { variant: 'Ресурсы и маршруты', summary: 'Выбор локомотива и доставка ресурсов для развития железной дороги.', challenge: 'Уместить экономическую механику в короткую игровую сессию с понятной первой целью.', implementation: 'Выбор поездов с разными характеристиками, маршруты доставки, счётчики ресурсов и контекстное обучение.', interaction: 'Выберите локомотив и разместите его на маршруте. Следите за доставкой древесины и развитием дороги.' },
    en: { variant: 'Resources & routes', summary: 'Choose a locomotive and deliver resources to develop a railway.', challenge: 'Turn an economy mechanic into a short session with a clear first objective.', implementation: 'Train selection with different capabilities, delivery routes, resource counters and contextual onboarding.', interaction: 'Choose a locomotive and place it on a route. Follow the timber deliveries and railway development.' }
  },
  {
    id: 'my-aquapark', folder: 'MA_play002', title: 'My Aquapark', category: 'simulation', format: '3D',
    ru: { variant: 'Свой аквапарк', summary: 'Открытие аттракционов, поток посетителей и развитие аквапарка.', challenge: 'Показать связь между вложением, реакцией посетителей и развитием бизнеса.', implementation: 'Покупка объектов в 3D-сцене, очередь посетителей, отображение настроения и пошаговые подсказки.', interaction: 'Откройте вход в аквапарк и посмотрите, как меняется поток посетителей.' },
    en: { variant: 'Build an aquapark', summary: 'Open attractions, welcome visitors and grow an aquapark.', challenge: 'Make the link between investment, visitor feedback and business growth easy to understand.', implementation: 'Purchasable objects in a 3D scene, visitor queues, mood feedback and step-by-step hints.', interaction: 'Open the aquapark entrance and watch the visitor flow change.' }
  },
  {
    id: 'pixel-gun', folder: 'CG.PixelGun', title: 'Pixel Gun 3D', category: 'action', format: '3D',
    ru: { variant: 'Прицеливание', summary: 'Шутер от первого лица с яркой воксельной сценой и движущимися целями.', challenge: 'Дать ощущение прицеливания и попадания с первого касания.', implementation: 'Камера от первого лица, движущиеся противники, оружие в кадре и обучение непосредственно в сцене.', interaction: 'Направьте прицел на противника и проверьте отклик оружия.' },
    en: { variant: 'Aim & shoot', summary: 'A first-person shooter with a vivid voxel scene and moving targets.', challenge: 'Deliver the feel of aiming and hitting from the first touch.', implementation: 'A first-person camera, moving enemies, an on-screen weapon and in-scene onboarding.', interaction: 'Aim at an enemy and try the weapon feedback.' }
  },
  {
    id: 'kingdom-clash', folder: 'KC_play120', title: 'Kingdom Clash', category: 'strategy', format: '3D',
    ru: { variant: 'Остановить орду', summary: 'Расстановка отрядов перед наступающей армией.', challenge: 'Сделать тактическую подготовку понятной на маленьком экране.', implementation: 'Перетаскивание юнитов на сетку, стоимость отрядов, визуальный масштаб армии и сценарий защиты.', interaction: 'Перетащите доступный отряд на поле и подготовьте оборону против орды.' },
    en: { variant: 'Stop the horde', summary: 'Deploy units to defend against an advancing army.', challenge: 'Make tactical preparation readable on a small screen.', implementation: 'Drag-and-drop unit placement, a deployment grid, unit costs and a large-scale defensive scenario.', interaction: 'Drag an available unit onto the field and prepare your defence.' }
  },
  {
    id: 'last-day-on-earth', folder: 'kefir_play006', title: 'Last Day on Earth', category: 'adventure', format: '3D',
    ru: { variant: 'Проникновение на базу', summary: 'Survival-сценарий с управлением персонажем и взаимодействием с окружением.', challenge: 'Соединить перемещение и действие в коротком эпизоде выживания.', implementation: 'Виртуальный джойстик, кнопки действий, изометрическая камера и окружение заброшенной базы.', interaction: 'Двигайте персонажа джойстиком, подойдите к базе и попробуйте доступные действия.' },
    en: { variant: 'Break into the base', summary: 'A survival scenario with character movement and environmental interaction.', challenge: 'Connect movement and action within a short survival encounter.', implementation: 'A virtual joystick, action buttons, an isometric camera and an abandoned-base environment.', interaction: 'Move with the joystick, approach the base and try the available actions.' }
  },
  {
    id: 'merge-mayor', folder: 'MERGE MAYOR', title: 'Merge Mayor', category: 'puzzle', format: '2D',
    ru: { variant: 'Объединение предметов', summary: 'Merge-головоломка: объединять предметы и освобождать поле от коробок.', challenge: 'Объяснить правило объединения одним наглядным действием.', implementation: 'Перетаскивание предметов по сетке, цепочки объединений, препятствия и подсказка первого хода.', interaction: 'Соедините одинаковые предметы. Посмотрите, как меняются предметы и освобождается поле.' },
    en: { variant: 'Merge & clear', summary: 'A merge puzzle about combining objects and clearing boxes from a board.', challenge: 'Explain the merge rule through one clear interaction.', implementation: 'Grid-based dragging, merge chains, obstacles and a first-move hint.', interaction: 'Combine matching objects and watch the items evolve as the board clears.' }
  },
  {
    id: 'mistland-saga', folder: 'MISLAND SAGA', title: 'Mistland Saga', category: 'adventure', format: '3D',
    ru: { variant: 'Мастерская и развитие', summary: 'Фэнтезийная 3D-сцена с ресурсами и открытием мастерской.', challenge: 'Показать цель развития через объект непосредственно в игровом мире.', implementation: 'Камера в фэнтезийном окружении, акцент на мастерской, ресурсный интерфейс и контекстные подсказки.', interaction: 'Следуйте подсказке открытия мастерской и проследите связь ресурса с развитием сцены.' },
    en: { variant: 'Workshop & progression', summary: 'A fantasy 3D scene with resources and a workshop to unlock.', challenge: 'Present a progression objective through an object in the game world.', implementation: 'A camera in a fantasy environment, workshop framing, resource UI and contextual hints.', interaction: 'Follow the workshop-unlock prompt and explore how resources drive progression.' }
  },
  {
    id: 'standoff-2', folder: 'SO2_KnivesFight', title: 'Standoff 2', category: 'action', format: '3D',
    ru: { variant: 'Поединок на ножах', summary: 'Ближний бой от первого лица с анимацией противника и шкалой здоровья.', challenge: 'Передать удар и ответ противника при управлении одним касанием.', implementation: 'Оружие от первого лица, анимации ближнего боя, состояние здоровья и подсказка атаки.', interaction: 'Коснитесь экрана для атаки и проследите реакцию противника и изменение здоровья.' },
    en: { variant: 'Knife duel', summary: 'First-person melee combat with enemy animation and a health bar.', challenge: 'Convey an attack and the enemy response through a single-touch input.', implementation: 'First-person weapons, melee animation, health state and an attack prompt.', interaction: 'Tap to attack and watch the enemy response and health feedback.' }
  },
  {
    id: 'fish-idle', folder: 'FishIdle', title: 'Fish Idle', category: 'simulation', format: '3D',
    ru: { variant: 'Рыболовный маршрут', summary: 'Управление лодкой в сцене с движущимися косяками рыб.', challenge: 'Сделать управление лодкой и цель сбора понятными без отдельного экрана обучения.', implementation: 'Виртуальный джойстик, движение лодки, рыбы в окружении и визуальная подсказка жеста.', interaction: 'Удерживайте экран и двигайте лодку к косяку рыб.' },
    en: { variant: 'Fishing route', summary: 'Steer a boat through a scene filled with moving schools of fish.', challenge: 'Explain boat controls and collection without a separate tutorial screen.', implementation: 'A virtual joystick, boat movement, ambient fish and a gesture hint.', interaction: 'Hold and drag to steer the boat towards a school of fish.' }
  },
  {
    id: 'candy-crush', folder: 'King_CCS', title: 'Candy Crush Saga', category: 'simulation', format: '3D',
    ru: { variant: 'Шоколадная фабрика', summary: 'Сбор шоколада и развитие производства в мире Candy Crush.', challenge: 'Адаптировать знакомый визуальный мир к механике движения и сбора ресурсов.', implementation: '3D-персонаж, виртуальное управление, сбор шоколада, зоны производства и интерфейс прогресса.', interaction: 'Двигайте персонажа к шоколаду и проследите путь ресурса к производству.' },
    en: { variant: 'Chocolate factory', summary: 'Collect chocolate and develop production in the Candy Crush world.', challenge: 'Adapt a familiar visual world to a movement-and-collection mechanic.', implementation: 'A 3D character, virtual controls, chocolate collection, production zones and progress UI.', interaction: 'Move towards the chocolate and follow the resource into production.' }
  },
  {
    id: 'klondike', folder: 'KLONDIKE', title: 'Klondike', category: 'simulation', format: '3D',
    ru: { variant: 'Развитие фермы', summary: 'Фермерский сценарий с перемещением героя и покупкой объектов.', challenge: 'Объяснить развитие фермы через действия в игровом пространстве.', implementation: 'Управление персонажем, зоны покупок с видимой стоимостью, фермерское окружение и направляющие подсказки.', interaction: 'Двигайте героя по ферме и подойдите к отмеченной зоне улучшения.' },
    en: { variant: 'Grow a farm', summary: 'A farming scenario with character movement and purchasable objects.', challenge: 'Explain farm progression through actions in the game world.', implementation: 'Character controls, purchase zones with visible costs, a farm environment and directional hints.', interaction: 'Move around the farm and approach the highlighted upgrade zone.' }
  },
  {
    id: 'web-master', folder: 'WM_play030', title: 'Web Master', category: 'action', format: '3D',
    ru: { variant: 'Выбор героя', summary: 'Выбор персонажа перед переходом к экшен-сценарию.', challenge: 'Сделать выбор героя частью первого игрового взаимодействия.', implementation: 'Карусель 3D-персонажей, переключение вариантов, подтверждение выбора и переход к игровому эпизоду.', interaction: 'Листайте героев стрелками, выберите персонажа и продолжите демо.' },
    en: { variant: 'Choose your hero', summary: 'Choose a character before entering an action scenario.', challenge: 'Make character selection part of the first interaction.', implementation: 'A 3D character carousel, selection controls, confirmation and a transition into gameplay.', interaction: 'Browse the heroes, choose a character and continue into the demo.' }
  },
  {
    id: 'forge-land', folder: 'FORG_play001', title: 'Forge Land', category: 'simulation', format: '3D',
    ru: { variant: 'Добыча и улучшения', summary: 'Добыча ресурсов и усиление рабочих на фоне поднимающейся лавы.', challenge: 'Связать покупку улучшений с понятной угрозой и видимым прогрессом.', implementation: 'Кнопки найма и скорости, стоимость улучшений, счётчик ресурсов и сценарий с ограничением времени.', interaction: 'Купите улучшение скорости или рабочего и наблюдайте за темпом добычи.' },
    en: { variant: 'Gather & upgrade', summary: 'Gather resources and upgrade workers as lava rises.', challenge: 'Connect upgrades to a clear threat and visible progress.', implementation: 'Hiring and speed controls, upgrade costs, a resource counter and a timed scenario.', interaction: 'Buy a speed upgrade or a worker and watch the gathering pace change.' }
  },
  {
    id: 'world-war-heroes', folder: 'WWH_play041', title: 'World War Heroes', category: 'action', format: '3D',
    ru: { variant: 'Прикрытие союзников', summary: 'Стрельба от первого лица по целям в многоуровневой боевой сцене.', challenge: 'Сфокусировать внимание на целях в насыщенном 3D-окружении.', implementation: 'Прицеливание, оружие от первого лица, выделение целей, счётчик боеприпасов и атмосферные эффекты.', interaction: 'Коснитесь цели, чтобы прицелиться, и попробуйте прикрыть союзников.' },
    en: { variant: 'Cover your allies', summary: 'First-person shooting across a layered combat environment.', challenge: 'Keep targets readable within a detailed 3D scene.', implementation: 'Aiming, a first-person weapon, target highlights, an ammo counter and atmospheric effects.', interaction: 'Tap a target to aim and try to cover your allies.' }
  },
  {
    id: 'paint-line', folder: 'PAINT', title: 'Paint Line', category: 'puzzle', format: '2D',
    ru: { variant: 'Рисование по точкам', summary: 'Соединение пронумерованных точек одним жестом.', challenge: 'Превратить простой жест в понятный процесс рисования.', implementation: 'Нумерованные точки, отслеживание линии, подсказка направления и постепенное раскрытие рисунка.', interaction: 'Проведите линию через точки по порядку, чтобы закончить рисунок.' },
    en: { variant: 'Connect & draw', summary: 'Connect numbered dots with a continuous gesture.', challenge: 'Turn a simple gesture into an intuitive drawing experience.', implementation: 'Numbered points, line tracking, a directional hint and gradual picture completion.', interaction: 'Draw through the points in order to complete the picture.' }
  },
  {
    id: 'zombie-shooter-01', folder: 'ZRS', title: 'Zombie Shooter', category: 'action', format: '3D',
    ru: { variant: 'Оборона участка', summary: 'Шутер у полицейского участка с дождём и ограниченным боезапасом.', challenge: 'Сохранить читаемость целей и управления в атмосферной тёмной сцене.', implementation: 'Камера от первого лица, наведение удержанием, группа противников, боезапас и погодные эффекты.', interaction: 'Удерживайте экран и ведите прицел по противникам перед участком.' },
    en: { variant: 'Police station defence', summary: 'A rainy police-station shooter with limited ammunition.', challenge: 'Keep targets and controls readable in a dark, atmospheric scene.', implementation: 'A first-person camera, hold-to-aim controls, multiple enemies, ammunition and weather effects.', interaction: 'Hold the screen and aim at the enemies outside the station.' }
  },
  {
    id: 'zombie-shooter-02', folder: 'ZRS_play2', title: 'Zombie Shooter', category: 'action', format: '3D',
    ru: { variant: 'Ночной бой', summary: 'Бой в тёмном помещении с контурным выделением противников.', challenge: 'Помочь быстро находить цели при ограниченной видимости.', implementation: 'Подсветка силуэтов, прицел, анимация оружия, счётчик патронов и обучение удержанием.', interaction: 'Удерживайте экран для стрельбы и используйте контуры, чтобы находить противников.' },
    en: { variant: 'Night encounter', summary: 'An indoor firefight with outlined enemies in a dark environment.', challenge: 'Help players find targets quickly in low visibility.', implementation: 'Enemy outlines, a crosshair, weapon animation, an ammo counter and a hold-to-shoot hint.', interaction: 'Hold to shoot and use the outlines to locate enemies.' }
  },
  {
    id: 'railroad-034', folder: 'RRE_play034', title: 'Railroad Empire', category: 'simulation', format: '3D',
    ru: { variant: 'Коллекция локомотивов', summary: 'Выбор локомотива в 3D-депо со сравнением мощности и скорости.', challenge: 'Превратить просмотр поездов в наглядный игровой выбор.', implementation: 'Карусель локомотивов в 3D-депо, характеристики мощности и скорости, направляющий жест и переход к маршруту.', interaction: 'Переключайте локомотивы стрелками, сравните их мощность и скорость, затем выберите поезд.' },
    en: { variant: 'Locomotive collection', summary: 'Choose a locomotive in a 3D depot and compare its power and speed.', challenge: 'Turn a train showcase into a clear in-game choice.', implementation: 'A 3D depot carousel, locomotive power and speed statistics, a gesture hint and a transition to the route.', interaction: 'Browse locomotives with the arrows, compare power and speed, then choose a train.' }
  },
  {
    id: 'railroad-037', folder: 'RRE_play037', title: 'Railroad Empire', category: 'simulation', format: '3D',
    ru: { variant: 'Выбор локомотива', summary: 'Сравнение поездов и развитие маршрута вокруг железнодорожной станции.', challenge: 'Показать разницу между вариантами через короткий выбор в игровом интерфейсе.', implementation: 'Карточки локомотивов с характеристиками, выделение выбора, станция в 3D и ресурсный интерфейс.', interaction: 'Сравните доступные локомотивы и выберите поезд для станции.' },
    en: { variant: 'Choose a locomotive', summary: 'Compare trains and develop a route around a railway station.', challenge: 'Explain the difference between options through a short in-game choice.', implementation: 'Locomotive cards with stats, selection feedback, a 3D station and resource UI.', interaction: 'Compare the available locomotives and choose a train for the station.' }
  },
  {
    id: 'railroad-039', folder: 'RRE_play039', title: 'Railroad Empire', category: 'simulation', format: '3D',
    ru: { variant: 'Управление составом', summary: 'Движение поезда по лесному маршруту с управлением рычагом.', challenge: 'Связать простой жест с движением тяжёлого состава и прогрессом доставки.', implementation: 'Управление удержанием, анимация состава, камера вдоль маршрута и ресурсный прогресс.', interaction: 'Удерживайте рычаг, чтобы двигать состав, и следите за прогрессом доставки.' },
    en: { variant: 'Drive the train', summary: 'Drive a train along a forest route using a lever.', challenge: 'Connect a simple gesture to the movement of a heavy train and delivery progress.', implementation: 'Hold controls, train animation, a route-following camera and resource progression.', interaction: 'Hold the lever to move the train and follow the delivery progress.' }
  },
  {
    id: 'railroad-054', folder: 'RRE_play054', title: 'Railroad Empire', category: 'simulation', format: '3D',
    ru: { variant: 'Из кабины машиниста', summary: 'Управление поездом от первого лица с рычагом в кабине.', challenge: 'Сделать управление поездом осязаемым через предмет непосредственно в кадре.', implementation: 'Кабина от первого лица, перетаскиваемый рычаг, приборная панель и движение по железной дороге.', interaction: 'Зажмите и потяните рычаг в кабине, чтобы управлять поездом.' },
    en: { variant: 'Inside the cab', summary: 'First-person train controls with an interactive lever inside the cab.', challenge: 'Make train control tangible through an object in the camera view.', implementation: 'A first-person cab, a draggable lever, a dashboard and railway movement.', interaction: 'Hold and drag the lever inside the cab to control the train.' }
  }
];

export const projects = catalog.map(project => ({
  ...project,
  src: `assets/${encodeURIComponent(project.folder)}/index.html`,
  preview: `assets/previews/${project.id}.jpg`
}));

// Находит работу по постоянному идентификатору.
export function findProject(id) {
  return projects.find(project => project.id === id) || null;
}

// Отбирает работы по жанру и поисковому запросу.
export function filterProjects({ category = 'all', query = '' } = {}) {
  const search = query.trim().toLocaleLowerCase();
  return projects.filter(project => {
    const matchesCategory = category === 'all' || project.category === category;
    const text = `${project.title} ${project.folder} ${project.ru.variant} ${project.en.variant} ${project.ru.summary} ${project.en.summary}`;
    return matchesCategory && text.toLocaleLowerCase().includes(search);
  });
}

// Читает безопасное состояние кейса и языка из адреса страницы.
export function readRoute(url, storedLang = 'ru') {
  const requested = url.searchParams.get('lang');
  const fallback = ['ru', 'en'].includes(storedLang) ? storedLang : 'ru';
  return {
    project: findProject(url.searchParams.get('project')),
    lang: ['ru', 'en'].includes(requested) ? requested : fallback
  };
}

// Создаёт прямую ссылку на кейс с сохранением пути сайта.
export function buildProjectUrl(currentUrl, id, lang) {
  if (!findProject(id)) throw new Error('Unknown project');
  const url = new URL(currentUrl);
  url.searchParams.set('project', id);
  url.searchParams.set('lang', lang === 'en' ? 'en' : 'ru');
  url.hash = 'case';
  return `${url.pathname}${url.search}${url.hash}`;
}
