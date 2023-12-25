import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import { Offices } from '@/components/Offices'
import Form from '@/components/Form'

export function ContactSection() {
  return (
    <Container className="mt-3 sm:mt-3 lg:mt-2">
      <FadeIn className="-mx-6 rounded-4xl px-6 py-20 sm:mx-0 sm:py-32 md:px-12">
        <div className="mx-auto max-w-4xl">
          <Form />
        </div>
      </FadeIn>
    </Container>
  )
}
