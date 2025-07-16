import dishApiRequest from '@/apiRequests/dish'
import { formatCurrency, generateSlugUrl } from '@/lib/utils'
import { DishListResType } from '@/schemaValidations/dish.schema'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')

  let dishList: DishListResType['data'] = []
  try {
    // Get featured dishes first, fallback to all dishes if no featured
    const featuredResult = await dishApiRequest.featured()
    if (featuredResult.payload.data.length > 0) {
      dishList = featuredResult.payload.data
    } else {
      const allResult = await dishApiRequest.list()
      // dishList = allResult.payload.data.slice(0, 6) // Limit to 6 items for 
      dishList = allResult.payload.data // Fallback to all dishes
    }
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
        <div className='z-20 relative py-16 md:py-20 px-4 sm:px-10 md:px-20'>
          <h2 className='text-center text-mobile-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white '>
            {t('title')}
          </h2>          
          <p className='text-center text-mobile-lg font-medium sm:text-base mt-4 text-white'>
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className='space-y-10 py-6'>
        <h2 className='text-center text-2xl font-bold text-foreground dark:text-foreground'>{t('dishes')}</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-10'>
          {dishList.map((dish) =>
           (
            <Link
              href={`/dishes/${generateSlugUrl({ name: dish.name, id: dish.id })}`}
              className='flex gap-4 w-full group'
              key={dish.id}
            >
              <div className='flex-shrink-0'>
                <Image
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={75}
                  alt={dish.name}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyLDSyRtaNHggsAwjQepyGZNfpkbj5rz3Oz2lneDEhVvs+h/TJ33v6v/9k="
                  className='object-cover w-[120px] h-[120px] rounded-md sm:w-[150px] sm:h-[150px] transition-transform duration-200 group-hover:scale-105'
                />
              </div>
              <div className='space-y-1 flex-1'>
                <h3 className='text-[16px] sm:text-2xl font-medium group-hover:text-primary transition-colors line-clamp-2'>
                  {dish.name}
                </h3>
                <p className='text-sm sm:text-base font-semibold text-primary'>
                  {formatCurrency(dish.price)}
                </p>
                <p className='text-xs sm:text-sm text-muted-foreground line-clamp-2'>
                  {dish.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
