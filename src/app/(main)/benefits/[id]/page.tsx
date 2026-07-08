// app/benefits/[id]/page.tsx
import { getBenefitById } from '@/server/services/mpartner/benefit.service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Ticket } from 'lucide-react';
import BenefitDetail from '../components/detail';
import { getCurrentUser } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { decodeId } from '@/lib/utils/hash';

interface BenefitDetailPageProps {
  params: {
    id: string
  }
}

export default async function BenefitDetailPage({ params }: BenefitDetailPageProps) {
  try {
    const resolvedParams = await params;
    const user = await getCurrentUser()
    const benefit = user?.email ? await getBenefitById(decodeId(resolvedParams.id), user.email) : null
 
    if (!benefit) {
      return <NotFoundPage />
    }

    return <BenefitDetail data={benefit} />
  } catch (error) {
    console.error('Error fetching benefit:', error)
    return <ErrorPage />
  }
}

async function NotFoundPage() {
  const t = await getTranslations('BenefitDetailPage')
  
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Card className="border-border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-4">
            <AlertCircle size={48} className="text-primary" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {t('benefitNotFound')}
        </h1>
        <p className="text-muted-foreground">
          {t('benefitNotFoundDesc')}
        </p>
        <span className="mb-6 block text-sm text-foreground">
          {t('pleaseInformUs')}
        </span>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild className="btn-primary gap-2">
            <Link href="/benefits">
              <Ticket size={16} />
              {t('browseAllBenefits')}
            </Link>
          </Button>
          <Button asChild variant="outline" className="btn-outline gap-2">
            <Link href="/">
              <ArrowLeft size={16} />
              {t('goHome')}
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}

async function ErrorPage() {
  const t = await getTranslations('BenefitDetailPage')
  
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Card className="border-border bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle size={48} className="text-destructive" />
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          {t('somethingWentWrong')}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {t('errorDesc')}
        </p>
        <Button asChild className="btn-primary gap-2">
          <Link href="/benefits">
            <Ticket size={16} />
            {t('backToBenefits')}
          </Link>
        </Button>
      </Card>
    </div>
  )
}