import numpy as np
import matplotlib.pylab as plt
import math
class hmix():
    def __init__(self):
        self.A_phiStar = 0.0
        self.A_nws13 = 0.0
        self.A_Vm23 = 0.0
        self.aA = 0.0
        self.A_name = ''
        self.B_phiStar = 0.0
        self.B_nws13 = 0.0
        self.B_Vm23 = 0.0
        self.aB = 0.0
        self.B_name = ''
        self.deH_A_partial_infDilute = 0.0
        self.P = 0.0
        self.RP = 0.0
        self.QP = 9.4
        self.e = 1.0
        self.element=[]
        self.elementName = {}
        self.elementPhiStar = {}
        self.elementNWS13 = {}
        self.elementVM23 = {}
        self.elementRP = {}
        self.elementTRAN = {}
        self.Avogardro = 6.02E23 # unit /mole
        self.xA = np.linspace(0.001,0.999,200)
        self.xAs = np.empty(len(self.xA))
        self.fxs = np.empty(len(self.xA))
        self.g = np.empty(len(self.xA))
        self.deHmix = np.empty(len(self.xA))
        self.xB = 1.0 - self.xA        
        self.__printHead()        
        self.__readDatabase()
        self.Gibbs=np.empty(len(self.xA))
        self.Gibbs2=0.000
        self.deHmix2=0.000
        self.user_xA=0.000
        self.user_xB=0.000
        self.xAs2 = 0.000
        self.fxs2 = 0.000
        self.g2 = 0.000
    def __printHead(self):
        print ('-------------------------------------------------')
        print ('-Calculate heat of mixing of binary metal system-')
        print ('-            based on Miedema scheme            -')
        print ('-              Writen by Jun Ou                 -')
        print ('-------------------------------------------------')
        return

    def __readDatabase(self):
        try:
            fReadDatabase = open('/database.dat','r')
            for line in fReadDatabase:
                elementTmp = line.replace('\n',' ').replace(' ','').split(',')
                
                #print elementTmp
                nameTmp = elementTmp[0]
                self.elementName[nameTmp] = elementTmp[0] 
                print('"',nameTmp,'"',end=',') 
                self.elementPhiStar[nameTmp] = elementTmp[1]                
                self.elementNWS13[nameTmp] = elementTmp[2]
                self.elementVM23[nameTmp] = elementTmp[3]
                self.elementRP[nameTmp] = elementTmp[4]
                self.elementTRAN[nameTmp] = elementTmp[5]
            print ('succesful initialization of the database.')    
            
        except ValueError:
            print ('database Error')
        return
    
    # get input for the two components    
    def inputElement(self,A,B,X): 
        self.A_name = A
        self.user_xA=X

        self.B_name = B
        self.user_xB=1.0-self.user_xA
        print(self.user_xB)
        #self.A_name = 'Ti'
        #self.B_name = 'Al'
        return
    
    def calRP(self):
        if self.elementTRAN[self.A_name]=='T' and self.elementTRAN[self.B_name]=='T':
            self.RP = 0.0
        elif self.elementTRAN[self.A_name]=='N' and self.elementTRAN[self.B_name]=='N':
            self.RP = 0.0
        else:
            self.RP = float(self.elementRP[self.A_name])*float(self.elementRP[self.B_name])*0.73
        return
    
    def assiginP(self):
        if self.elementTRAN[self.A_name]=='T' and self.elementTRAN[self.B_name]=='T':
            self.P = 0.147
        elif self.elementTRAN[self.A_name]=='N' and self.elementTRAN[self.B_name]=='N':
            self.P = 0.111
        else:
            self.P = 0.128            
        return    
    
    def decideA(self):
        Alkali = ['Li','Na','K','Rb','Sc','Fr']
        for itm in Alkali:
            if self.elementName[self.A_name] == itm:
                self.aA = 0.14
            if self.elementName[self.B_name] == itm:
                self.aB = 0.14
        return 
        
    
    def calHmix_user(self):
        self.A_phiStar = float(self.elementPhiStar[self.A_name])
        self.B_phiStar = float(self.elementPhiStar[self.B_name])
        self.A_nws13 = float(self.elementNWS13[self.A_name])
        self.B_nws13 = float(self.elementNWS13[self.B_name])
        self.A_Vm23 = float(self.elementVM23[self.A_name])
        self.B_Vm23 = float(self.elementVM23[self.B_name])
        dePhi = self.A_phiStar-self.B_phiStar
        deNws13 = self.A_nws13-self.B_nws13
        
        
    
        self.A_Vm23Alloy = self.A_Vm23*(1+self.aA*self.user_xB*(dePhi))
        self.B_Vm23Alloy = self.B_Vm23*(1+self.aB*self.user_xA*(-1*dePhi))
        self.xAs2 = self.user_xA*self.A_Vm23Alloy/(self.user_xA*self.A_Vm23Alloy+self.user_xB*self.B_Vm23Alloy)
        self.fxs2 = self.xAs2*(1.0-self.xAs2)
        self.g2 = 2.0*(self.user_xA*self.A_Vm23Alloy+self.user_xB*self.B_Vm23Alloy)/(1.0/self.A_nws13+1.0/self.B_nws13)
        self.deHmix2 = self.Avogardro*self.fxs2*self.g2*self.P*(-self.e*(dePhi)**2+self.QP*(deNws13)**2-self.RP)*1.60217657E-22
        self.Gibbs2=self.deHmix2+4273.15*8.314*(self.user_xA*math.log(self.user_xA)+self.user_xB*math.log(self.user_xB))
        print("the enthalpy for the asked mole fraction is ",self.deHmix2)
        print("the gibbs energy for the asked mole fraction is ",self.Gibbs2)
        self.deH_A_partial_infDilute =2.0*self.A_Vm23/(1.0/self.A_nws13+1.0/self.B_nws13)*self.Avogardro*self.P*(-self.e*(dePhi)**2+self.QP*(deNws13)**2-self.RP)*1.60217657E-22
        
        return self.Gibbs2
                         
#def main():
#    H = hmix()
#    H.inputElement(A, B, X)
#    H.calRP()
#    H.assiginP()
#    H.decideA()
#    H.calHmix_user()
#    #H.calHmix()
#    #H.report()
#    #H.plot()
        
#    return
    
#if __name__=='__main__':
#    main()##
