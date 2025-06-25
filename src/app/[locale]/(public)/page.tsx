import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
// import Link from 'next/link'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')

  let dishList: DishListResType['data'] = []
  try {
    const result = await dishApiRequest.list()
    const {
      payload: { data }
    } = result
    dishList = data
  } catch (error) {
    return <div>Something went wrong</div>
  }
  return (
    <div className='w-full space-y-4'>
      <section className='relative z-10 w-full overflow-hidden h-[200px] sm:h-[300px] '>
        <span className='absolute top-0 left-0 w-full h-full bg-black opacity-40 z-10'></span>
        <Image
          src='/banner.jpg'
          width={500}
          height={500}
          quality={100}
          alt='Banner'
          priority
          className='absolute top-0 left-0 w-full object-cover h-[200px] sm:h-[300px] '
        />
        <div className='z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20'>
          <h2 className='text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white dark:text-white'>
            {t('title')}
          </h2>          <p className='text-center text-sm sm:text-base mt-4 text-white/90 dark:text-white/90'>
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className='space-y-10 py-16'>
        <h2 className='text-center text-2xl font-bold text-foreground dark:text-foreground'>{t('dishes')}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {dishList.map((dish) => (
            <Link
              href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`}
              className='flex gap-4 w' key={dish.id}>
              <div className='flex-shrink-0'>
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={100}
                  alt={dish.name}
                  className='object-cover w-[120px] h-[120px] rounded-md sm:w-[150px] sm:h-[150px]'
                />
              </div>
              <div className='space-y-1'>
                <h3 className='text-[16px] sm:text-2xl'>{dish.name}</h3>
                <p className=''>{formatCurrency(dish.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
