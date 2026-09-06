export const email = 'nerakolo@outlook.com'
export const emailHref = `mailto:${email}`
export const friendRequestHref = `${emailHref}?subject=${encodeURIComponent('友链申请')}`

export const navigation = [
  { href: '#about', label: '关于', english: 'About' },
  { href: '#links', label: '链接', english: 'Elsewhere' },
  { href: '#friends', label: '友链', english: 'Friends' },
]

export const directions = ['Code', 'Vibe Coding', 'AI Applications']

export const interests = [
  { title: '在代码里', items: ['Frontend', 'Backend', 'Minecraft Server'] },
  { title: '在生活里', items: ['Vocaloid', 'Anime', 'Music'] },
]

export const socialLinks = [
  {
    id: 'github',
    name: 'GitHub',
    caption: '代码与创作',
    href: 'https://github.com/Nerakolox',
    address: 'github.com/Nerakolox',
    arrowSize: 28,
  },
  {
    id: 'gitee',
    name: 'Gitee',
    caption: '另一处代码仓库',
    href: 'https://gitee.com/Nerakolo',
    address: 'gitee.com/Nerakolo',
    arrowSize: 25,
  },
]

export const friendLinks = [
  {
    id: 'tools',
    name: 'Feedra',
    caption: '我的独立站',
    href: 'https://www.feedra.org/',
    domain: 'www.feedra.org',
    arrowSize: 29,
  },
  {
    id: 'club',
    name: 'Axolotland',
    caption: '朋友们的游戏俱乐部',
    href: 'https://axogc.net/',
    description: 'Gaming club',
    domain: 'www.axogc.net',
    arrowSize: 27,
  },
]
