import React, { useState } from 'react'
import {
    Modal,
    Button,
    Text,
    ActionIcon,
    Input,
    Password,
    Checkbox,
  } from "rizzui";
  import { XMarkIcon } from "@heroicons/react/20/solid";

export default function TestModal() {
    const [modalState, setModalState] = useState(false);
  return (
    <>
    {/* <img alt='test'src="https://th.bing.com/th/id/R.6c12b599fc19efd883e0ac3181af7a3c?rik=fvAV0WgZEtWMzA&pid=ImgRaw&r=0" onClick={() => setModalState(true)}>Custom Size Modal</img> */}
    <img src="https://th.bing.com/th/id/R.6c12b599fc19efd883e0ac3181af7a3c?rik=fvAV0WgZEtWMzA&pid=ImgRaw&r=0" alt="" onClick={() => setModalState(true)} />
    <Modal
      isOpen={modalState}
      onClose={() => setModalState(false)}
      customSize="1080px"
    >
      <div className="m-auto px-7 pt-6 pb-8">
        <div className="mb-7 flex items-center justify-between">
          <Text className="h3">Welcome to RizzUI</Text>
          <ActionIcon
            size="sm"
            variant="text"
            onClick={() => setModalState(false)}
          >
            <XMarkIcon className="h-auto w-6" strokeWidth={1.8} />
          </ActionIcon>
        </div>
      
        <div className="grid grid-cols-2 gap-y-6 gap-x-5 [&_label>span]:font-medium">
          <Input label="First Name *" inputClassName="border-2" size="lg" />
          <Input label="Last Name *" inputClassName="border-2" size="lg" />
          <Input
            label="Email *"
            inputClassName="border-2"
            size="lg"
            className="col-span-2"
          />
          <Password
            label="Password *"
            inputClassName="border-2"
            size="lg"
            className="col-span-2"
          />
          <Password
            label="Confirm Password *"
            inputClassName="border-2"
            size="lg"
            className="col-span-2"
          />
          <Checkbox
            size="lg"
            inputClassName="border-2"
            className="col-span-2"
            label={
              <Text className="text-sm">
                I agree to RizzUI&lsquo;s{" "}
                <a className="underline">Terms of Service</a> and{" "}
                <a className="underline">Privacy Policy</a>
              </Text>
            }
          />
          <Button
            type="submit"
            size="lg"
            className="col-span-2 mt-2"
            onClick={() => setModalState(false)}
          >
            Create an Account
          </Button>
        </div>
      </div>
    </Modal>
  </>
  )
}
